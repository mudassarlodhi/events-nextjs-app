import { useRef } from 'react';
import classes from './newsletter-registration.module.css';

function NewsletterRegistration() {
  
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

    fetch("/api/newsletter" , {
      method: "POST",
      body: JSON.stringify(reqBody),
      headers: { 
        'Content-Type': 'application/json'
      }
    })
    .then(response=>response.json())
    .then(response=>console.log(response));
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
