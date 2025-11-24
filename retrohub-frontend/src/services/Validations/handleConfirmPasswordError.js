export default function handleConfirmPasswordError({password,confirmPassword}){
    console.log("in confirm password handler");
    console.log("password=",password);
    console.log("confirm password",confirmPassword);
    if(password!=confirmPassword){
        return "Password and Confirm Password should match exactly.";
    }else{
      
        return ""
    }
}

