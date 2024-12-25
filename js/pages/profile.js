const apiService = new ApiService();

$('#logout').click( async() => {
  apiService.logout()
});

$(document).ready( async() => {
  await apiService.initConfig();

  await apiService.checkAuthentication();

  try {
    const user = await apiService.getCurrentUser();
    $('#username').text(user.username);
  } catch (error) {
    console.error(error);
  }
});