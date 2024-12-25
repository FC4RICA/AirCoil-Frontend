const apiService = new ApiService()

const form = $('#formUploadPic');
form.on('submit', async (event) => {
  event.preventDefault();

  if (!form[0].checkValidity()) {
    return;
  }
  
  console.log($('#formFile')[0].files[0])
  const imageInput = $('#formFile')[0].files[0];
  const jobData = {
    mileage: $('#mile_number').val(),
    car: {
      licensePlate: $('#license_plate').val(),
      provinceId: $('#province_id').val(),
      modelId: $('#model_id').val()
    }
  };

  try {
    const job = await apiService.createJob(imageInput, jobData);
    window.location.href = `../../pages/edl-result.html?id=${job.id}`;
  } catch (error) {
    console.error(error);
  }
});

$('#take-picture').change((event) => {
  $('#uploadName').text(event.target.files[0].name);
})

$(document).ready(async () => {
  await apiService.initConfig();

  await apiService.checkAuthentication();

  try {
    const user = await apiService.getCurrentUser();
    $('#service_center').text(user.branch.serviceCenter.name);
    $('#branch').text( user.branch.name);
    $('#username').text(user.username);
  } catch (error) {
    console.error(error);
    
  }

  $('#currentDate').text(new Date().toISOString().split('T')[0]);

  try {
    const models = await apiService.getCarModels();
    $.each(models, (index, model) => {
      $('#model_id').append(`<option value="${model.id}">${model.name}</option>`);
    });
  } catch (error) {
    console.error(error); 
  }

  try {
    const provinces = await apiService.getProvinces();
    $.each(provinces, (index, province) => {
      $('#province_id').append(`<option value="${province.id}">${province.name}</option>`);
    });
  } catch (error) {
    console.error(error);
  }
});