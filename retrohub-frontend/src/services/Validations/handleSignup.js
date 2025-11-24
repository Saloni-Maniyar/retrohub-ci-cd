export function handleSignup({name,email,password,confirmPassword}){
    console.log("in handle signup");
   let nameErr="";
   let passwordErr="";
   let confirmPasswordErr="";
    let emailErr="";
    //name validation
    if(!name.trim()){
        nameErr="Name is required";
    }else if(name.length<3){
        nameErr="Name should be at least 3 character long";
    }else if(!/^[A-Za-z\s]+$/.test(name)){
        nameErr="Name should contain only letters and spaces";
    }else{
        nameErr="";
    }

    //email validation 
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!email.trim()){
        emailErr="Email is required";

    }else if(!emailRegex.test(email)){
        emailErr="Please Enter a valid email address";
    }else{
        emailErr="";
    }

    //password validation 
    const upperCase = /[A-Z]/;
    const lowerCase = /[a-z]/;
    const number = /[0-9]/;
    const specialChar = /[!@#$%^&*(),.?":{}|<>]/;
    if (!password) {
        passwordErr= "Password is required.";
    }else if (password.length < 8) {
        passwordErr="Password must be at least 8 characters long.";
    }else if (!upperCase.test(password)) {
        passwordErr="Password must contain at least one uppercase letter.";
    }else if (!lowerCase.test(password)) {
        passwordErr="Password must contain at least one lowercase letter.";
    }else if (!number.test(password)) {
        passwordErr="Password must contain at least one number.";
    }else if (!specialChar.test(password)) {
        passwordErr="Password must contain at least one special character.";
    }else{
        passwordErr="";
    }

   //confirm Password validation 
    if (!confirmPassword) {
    confirmPasswordErr="Please confirm your password.";
    }else if (password !== confirmPassword) {
        confirmPasswordErr="Passwords do not match.";
    }else{
        confirmPasswordErr="";
    }
 

    return {nameErr,emailErr,passwordErr,confirmPasswordErr}
}
