import "../styles/AddMembersModal.css"
import { sendInvites } from "../services/ApiHandlers/sendInviteApi"; 
import validateMembers from "../services/Validations/handleAddMembers";
import { useState } from "react";
export default function AddMembersModal({teamId,onClose}){
    const [emails,setEmails]=useState("");
    const [addMembersError,setAddMembersError]=useState('');
    const [addMemberSuccessMessage,setAddMemberSuccessMessage]=useState('');
    const [emailError,setEmailError]=useState('');
    const handleSubmit=async (e)=>{
        e.preventDefault();
        const {emailError}=validateMembers({emails});
        setEmailError(emailError);

        if(!emailError){
            try{
                const emailList = emails.split(",").map(e => e.trim()).filter(Boolean);
                const res=await sendInvites({teamId,emails:emailList});
                console.log(res);
                setAddMemberSuccessMessage("Invite Sent Successfully");

                setEmailError('');
                setEmails('');
                setAddMembersError('');
                setTimeout(() => {
                     onClose();
                }, 2000);
            }catch(err){
                setAddMembersError(err.response?.data?.message || "Error Adding Members.");
                setAddMemberSuccessMessage('')
            }
        }

    }
    return(
        <div className="AddMembersModal">
                <h2>Add Members</h2>
                {emailError && <p>{emailError}</p>}
                {addMembersError && <p>{addMembersError}</p>}
                {addMemberSuccessMessage && <p className="successMessage">{addMemberSuccessMessage}</p>}
                
                <form onSubmit={handleSubmit}>
                     <textarea placeholder="Enter emails, comma separated" rows={4}
                      value={emails}
                        onChange={(e) => setEmails(e.target.value)}
                     >
                       
                    </textarea>
                      <div className="modal-actions">
                      <button type="reset" onClick={onClose}>Cancel</button>
                      <button type="submit">Send Invites</button>
                    </div>
                </form>
               
  
        </div>
    );
}