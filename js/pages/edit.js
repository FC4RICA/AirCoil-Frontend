const apiService = new ApiService();

var job = {};

const form = $('#formUploadPic');
form.on('submit', async (event) => {
  event.preventDefault();

  if (!form[0].checkValidity()) {
    return;
  }

  const carData = {
    licensePlate: $('#new_license_plate').val(),
    provinceId: $('#new_province_id').val(),
    modelId: $('#new_model_id').val()
  };
  try {
    await apiService.updateCar(job.car.id, carData).then(() => {
      window.location.href = `../../pages/edl-result.html?id=${job.id}`;
    });
  } catch (error) {
    console.error(error);
    alert('Failed to update car. Please try again later.');
  }
});

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

  const models = await apiService.getCarModels();
  $.each(models, (index, model) => {
    $('#new_model_id').append(`<option value="${model.id}">${model.name}</option>`);
  });

  const provinces = await apiService.getProvinces();
  $.each(provinces, (index, province) => {
    $('#new_province_id').append(`<option value="${province.id}">${province.name}</option>`);
  });

  const urlParams = new URLSearchParams(window.location.search);
  const jobId = urlParams.get('id');

  job = await apiService.getJob(jobId);

  // Set job details dynamically
  $('#jobId').text(job.id);
  $('#jobDateFull').text(new Date(job.createdAt).toISOString().split("T")[0]);

  $('#license').text(job.car.licensePlate);
  $('#province').text(job.car.province.name);
  $('#mileInfo').text(job.mileage);
  $('#carBrand').text(job.car.model.brand.name);
  $('#carModel').text(job.car.model.name);
  $('#airCoilImage').attr('src', job.images[0].url);  

});