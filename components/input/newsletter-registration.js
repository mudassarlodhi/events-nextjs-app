import { useContext, useRef } from 'react';
import NotificationContext from '../../store/notification-context';
import classes from './newsletter-registration.module.css';

function NewsletterRegistration() {
  const notificationCtx = useContext(NotificationContext);  
  const emailInputRef = useRef();
  
  function registrationHandler(event) {
    event.preventDefault();
    const email = emailInputRef.current.value;

    if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))){
      return alert('Invalid Email');
    }
    
    const reqBody = {
      email
    };

    notificationCtx.showNotification({
      title: 'Signing up.....',
      message: 'Signing for newsletter',
      status: 'pending'
    });

    fetch("/api/newsletter" , {
      method: "POST",
      body: JSON.stringify(reqBody),
      headers: { 
        'Content-Type': 'application/json'
      }
    })
    .then(response=>{
      if(response.ok){
        return response.json()
      }

      return response.json().then(data=>{
        throw new Error(data.message || 'Something went wrong')
      });
    })
    .then(_=>{
      notificationCtx.showNotification({
        title: 'Success!',
        message: 'Successfully registered for newsletter!',
        status: 'success'
      });
    })
    .catch(error=>{
      notificationCtx.showNotification({
        title: 'Error!',
        message: error.message || 'Something went wrong!',
        status: 'error'
      });
    });
  }

  return (
    <section className={classes.newsletter}>
      <h2>Sign up to stay updated!</h2>
      <form onSubmit={registrationHandler}>
        <div className={classes.control}>
          <input
            type='email'
            id='email'
            placeholder='Your email'
            aria-label='Your email'
            ref={emailInputRef}
          />
          <button>Register</button>
        </div>
      </form>
    </section>
  );
}

export default NewsletterRegistration;
