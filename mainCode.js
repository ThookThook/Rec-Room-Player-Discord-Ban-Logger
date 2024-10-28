function main() {
    // get bearer token in browser storage and assign the value to var.
    let authToken = getToken(); if(authToken == undefined){return;}
    console.log(authToken);

    // request headers
    headers = new Headers({
        "Authorization": authToken
    });

    const userName = getUserName(); if(userName == undefined){return;}

    // make the request using Rec Room's API
    fetch(`https://accounts.rec.net/account?username=${userName}`, { headers })
        .then(response => response.json())
        .then(response => {
            let banLog = formatBanLog(response);
            // Set program back to focus to access clipboard
            oldFocus.focus();  navigator.clipboard.writeText(banLog);
            
            // Now the program isn't in focus anymore ;[
            alert(banLog);
            alert("Success!!");
        })
        .catch(error => {
            console.error("Error:", error);
            alert("Fetch request failed. Please restart the program and check iof the information you inputed is correct.");
        });
}

/* This function has two similar templates for the ban log,
and will fill in the info from provided data.
The player data is the responce from the request in main()
This function is ment to be modifiable by user to fit their desires and prefrences */
function formatBanLog(playerData) {
    let banSig;
    
    /* these templates will be chosen dependent on 
    if the display name of the player is the same as the username of the player*/
    if (playerData["username"] !== playerData["displayName"]) {
        banSig = `BAN **[@${playerData["username"]}](<https://rec.net/user/${playerData["username"]}>)**<ID: **${playerData["accountId"]}**> (Display: **"${playerData["displayName"]}"**)`;
    } else {
        banSig = `BAN **[@${playerData["username"]}](<https://rec.net/user/${playerData["username"]}>)**<ID: **${playerData["accountId"]}**>`;
    }

    let reasonList = "";
    while (true) {
        let reason = prompt("Reason: ");
        if (!reason) {
            break;
        }
        reasonList += `\n\t– ${reason}`;
    }
    /* Ask if the ban came from a other player's report?
    if yes, the program will add that extra bit of info to the log */
    alert("FYI: The following \"confirm\" prompt options are:\nOK = Yes/True\nCancel = No/False");
    if(confirm("Is this from a report?")){
        // Is from Staff ban request:
        if(confirm("Staff Ban Appeal (OK) or Player Report (Cancel)")) {
            reasonList += `\n\t**[// ACCEPTED BAN REQUEST //](<${prompt("Enter ban request Link")}>)**`;
        } 
        // Is from player report:
        else {
            if(confirm("Does this report have a veiwable link to staff\te.g, A player report in a dm is not viewable to anyone of the staff team without screenshot.")) {
                reasonList += `\n\t**[// ACCEPTED REPORT FROM PLAYER //](<${prompt("Enter report Link")}>)**`;
            } else {
                reasonList += `\n\t**// ACCEPTED REPORT FROM PLAYER //**`;
            }
        }
    }

    return banSig + reasonList + "\n}";
}

// Gets Beaer auth token
function getToken() {
    try {
        return `Bearer ${JSON.parse(localStorage.getItem("na_current_user_session"))["accessToken"]}`;
    } catch (error) {
        alert("Not logged in on RecNet!, exiting program...");
        return;
    }
}

// Gets the banned player's username.
function getUserName() {
    authToken = getToken();

    headers = new Headers({
        "Authorization": authToken
    });

    let userName = prompt("Enter your recroom username: ");
    /* if user inputs actual username */
    if (userName.includes("@")) {
        userName = userName.substring(1);
    } /* if user inputs recnet link */
    else if(userName.includes("https://rec.net/user/")) {
        userName = userName.substring(21, userName.length);
    } /* if user inputs user ID */
    else if(0 / userName != NaN){
        fetch(`https://accounts.rec.net/account?username=${userName}`, { headers })
        .then(response => response.json())
        .then(data => {userName = data["username"]})
        .catch(error => {
            console.error("Error:", error)
            return;
        });
    }
    return userName;
}

const oldFocus = document.activeElement; // This will make the return to focus later
main();
