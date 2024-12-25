const apiService = new ApiService();

const form = $('#searchForm');
form.submit( async(event) => {
  event.preventDefault();

  if (!form[0].checkValidity()) {
    return;
  }

  const licensePlate = $('#license_plate').val();
  const provinceId = $('#province_id').val();

  try {
    const car = await apiService.getCar(licensePlate, provinceId);
    if (!car.length) {
      return $('#error').html('<div class="alert alert-danger">ไม่พบข้อมูลรถ</div>');
    }
    window.location.href = `../../pages/list.html?licensePlate=${car[0].licensePlate}&province=${car[0].province.id}`;
  } catch (error) {
    console.error(error);
  }
});


$(document).ready( async() => {
  await apiService.initConfig();

  await apiService.checkAuthentication();
  
  try {
    const provinces = await apiService.getProvinces();
    $.each(provinces, (index, province) => {
      $('#province_id').append(`<option value="${province.id}">${province.name}</option>`);
    });
  } catch (error) {
    console.error(error);
  }
  
});