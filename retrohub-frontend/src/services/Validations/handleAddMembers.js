 export default function validateMembers({emails}){
    console.log("inside validateMembers");
     let emailError = "";

    if (!emails.trim()) {
        emailError = "Please enter at least one email.";
    } else {
        // Split by comma, trim spaces, remove empty strings
        const emailList = emails.split(",").map(e => e.trim()).filter(Boolean);
     console.log("email list ",emailList);

    // Regex for basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        const invalidEmails = emailList.filter(email => !emailRegex.test(email));
        if (invalidEmails.length > 0) {
             emailError = `Invalid email(s): ${invalidEmails.join(", ")}`;
         }
  }

  return { emailError };
}