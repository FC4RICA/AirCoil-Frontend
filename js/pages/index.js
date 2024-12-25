const apiService = new ApiService();

// Handle login
const form = $("#login_form");
form.submit( async(event) => {
  event.preventDefault();
  
              
  if (!form[0].checkValidity()) {
    return;
  }

  const username = $("#username").val();
  const password = $("#password").val();

  try {
    await apiService.login(username, password);
    window.location.replace('../../pages/profile.html');
  } catch (error) {
  }
});


$(document).ready( async() => {
  await apiService.initConfig();

  try {
    await apiService.getCurrentUser();
    window.location.replace('../../pages/profile.html');
  } catch (error) {    
  }
});