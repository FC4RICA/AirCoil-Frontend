const apiService = new ApiService();

$('#pdfDownload').click(() => {
  window.print()
})

let job = {};

$(document).ready( async() => {
  await apiService.initConfig();

  await apiService.checkAuthentication();

  const urlParams = new URLSearchParams(window.location.search);
  const jobId = urlParams.get('id');

  const job = await apiService.getJob(jobId);

  // Set job details dynamically
  $('#job-id').text(job.id);
  $('#job-date').text(new Date(job.createdAt).toISOString().split("T")[0]);

  $('#license-plate').text(job.car.licensePlate);
  $('#province').text(job.car.province.name);
  $('#mileage').text(job.mileage);
  $('#car-brand').text(job.car.model.brand.name);
  $('#car-model').text(job.car.model.name);
  $('#aircoil-image').attr('src', job.images[0].url);  

  $('#edlscore-container').html(`
    <div class="edl-lv${job.result.edlLevel} edlscore-description">
      <h3>EDL LV${job.result.edlLevel}</h3>
      ${job.result.description}
    </div>
  `);
});