javascript:(function() {
    function main() {
        let authToken = getToken(); if (authToken == undefined) { return; }
        console.log(authToken);
        let headers = new Headers({ "Authorization": authToken });
        const userName = getUserName(); if (userName == undefined) { return; }
        fetch(`https://accounts.rec.net/account?username=${userName}`, { headers })
            .then(response => response.json())
            .then(response => {
                let banLog = formatBanLog(response);
                oldFocus.focus(); navigator.clipboard.writeText(banLog);
                alert(banLog);
                alert("Success!!");
            })
            .catch(error => {
                console.error("Error:", error);
                alert("Fetch request failed. Please restart the program and check if the information you inputted is correct.");
            });
    }

    function formatBanLog(playerData) {
        let banSig;
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
        alert("FYI: The following \"confirm\" prompt options are:\nOK = Yes/True\nCancel = No/False");
        if (confirm("Is this from a report?")) {
            if (confirm("Staff Ban Appeal (OK) or Player Report (Cancel)")) {
                reasonList += `\n\t**[// ACCEPTED BAN REQUEST //](<${prompt("Enter ban request Link")}>)**`;
            } else {
                if (confirm("Does this report have a viewable link to staff\te.g, A player report in a dm is not viewable to anyone of the staff team without screenshot.")) {
                    reasonList += `\n\t**[// ACCEPTED REPORT FROM PLAYER //](<${prompt("Enter report Link")}>)**`;
                } else {
                    reasonList += `\n\t**// ACCEPTED REPORT FROM PLAYER //**`;
                }
            }
        }
        return banSig + reasonList + "\n}";
    }

    function getToken() {
        try {
            return `Bearer ${JSON.parse(localStorage.getItem("na_current_user_session"))["accessToken"]}`;
        } catch (error) {
            alert("Not logged in on RecNet!, exiting program...");
            return;
        }
    }

    function getUserName() {
        let authToken = getToken();
        let headers = new Headers({ "Authorization": authToken });
        let userName = prompt("Enter your recroom username: ");
        if (userName.includes("@")) {
            userName = userName.substring(1);
        } else if (userName.includes("https://rec.net/user/")) {
            userName = userName.substring(21);
        } else if (0 / userName != NaN) {
            fetch(`https://accounts.rec.net/account?username=${userName}`, { headers })
                .then(response => response.json())
                .then(data => { userName = data["username"]; })
                .catch(error => {
                    console.error("Error:", error);
                    return;
                });
        }
        return userName;
    }

    const oldFocus = document.activeElement;
    main();
})();