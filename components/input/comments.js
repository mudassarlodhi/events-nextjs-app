import { useState, useEffect, useContext } from 'react';
import NotificationContext from '../../store/notification-context';
import CommentList from './comment-list';
import NewComment from './new-comment';
import classes from './comments.module.css';

function Comments(props) {
  const { eventId } = props;

  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [isFetchingComments, setIsFetchingComments] = useState(false);
  const { showNotification } = useContext(NotificationContext);


  useEffect(() => {
    if(showComments){
      setIsFetchingComments(true);
      fetch(`/api/comments/${eventId}`)
      .then(response=>response.json())
      .then(data=>{
        setIsFetchingComments(false);
        setComments(data.comments); 
      });
    }
  }, [showComments]);

  function toggleCommentsHandler() {
    setShowComments((prevStatus) => !prevStatus);
  }

  function addCommentHandler(commentData) {
    
    showNotification({
      title: 'Loading',
      message: 'Your comment is being added',
      status: 'pending'
    });

    fetch(`/api/comments/${eventId}` , {
      method: 'POST',
      body: JSON.stringify(commentData),
      headers: { 
        'Content-Type': 'application/json'
      }
    })
    .then(response=>{
      if(response.ok){
        return response.json()
      }
      return response.json().then(data=>{
        throw new Error(data.error || 'Error adding comment')
      });
    })
    .then(({ comment })=>{
      showNotification({
        title: 'Success!',
        message: 'Your comment is added',
        status: 'success'
      }); 
      setComments((prevComments) => [comment , ...prevComments]);
    })
    .catch(error=>{
      showNotification({
        title: 'Error!',
        message: error.message,
        status: 'error'
      }); 
    });
  }

  return (
    <section className={classes.comments}>
      <button onClick={toggleCommentsHandler}>
        {showComments ? 'Hide' : 'Show'} Comments
      </button>
      {showComments && <NewComment onAddComment={addCommentHandler} />}
      {showComments && !isFetchingComments && <CommentList items={comments} />}
      {showComments && isFetchingComments && <p>Loading.....</p>}
    </section>
  );
}

export default Comments;
