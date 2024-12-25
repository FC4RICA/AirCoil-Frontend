const apiService = new ApiService();

let jobsPage = {};

const fetchJobs = async(startDate, endDate, pageNumber = 1) => {  
  try {
    jobsPage = await apiService.getJobs({ startDate, endDate, pageNumber });
    renderJobs();
  } catch (error) {
    console.error(error);
    $("#not-found").show();
  }
}

const renderJobs = () => {
  const jobList = $("#job-list");
  jobList.empty(); // Clear previous results

  var jobs = jobsPage.data;

  if (!jobs || jobs.length === 0) {
    $("#not-found").show();
    $("#pagination-nav").hide();
    return;
  }

  $("#not-found").hide();

  jobs.forEach((job) => {
    const formattedDate = new Date(job.createdAt).toISOString().split("T")[0];
    
    jobList.append(`
      <li class="list-group-item">
        <div class="row">
          <div class="col-md-8">
            <p>Job No: ${job.id}</p>
            <!-- <p>ชื่อผู้ใช้งาน: ${job}</p> -->
            <p>ป้ายทะเบียนรถ: ${job.car.licensePlate} ${job.car.province.name}</p>
            <p>วันที่ทำการ: ${formattedDate}</p>
          </div>
          <div class="col-md-4">
            <img src="${job.images[0].url}" width="100%" style="margin-bottom: 10px;">
            <a role="button" class="btn btn-success" href="../../pages/edl-result.html?id=${job.id}"">ผลการประเมิน</a>
            <a role="button" class="btn btn-danger" href="../../pages/edit.html?id=${job.id}"">แก้ไข</a>
          </div>
        </div>
      </li>
    `);
  });

  renderPagination(jobsPage.currentPage, jobsPage.totalPages);
}


const renderPagination = (currentPage, totalPages) => {
  const pagination = $(".pagination");
  pagination.empty();

  pagination.append(`
    <li class="page-item ${currentPage === 1 ? "disabled" : ""}">
      <a class="page-link" href="#" onclick="fetchJobs('${$("#startDate").val()}', '${$("#finishDate").val()}', 1)">หน้าแรก</a>
    </li>
    <li class="page-item ${currentPage === 1 ? "disabled" : ""}">
      <a class="page-link" href="#" onclick="fetchJobs('${$("#startDate").val()}', '${$("#finishDate").val()}', ${currentPage - 1})"><<</a>
    </li>
    <li class="page-item disabled">
      <a class="page-link">${currentPage}</a>
    </li>
    <li class="page-item ${currentPage === totalPages ? "disabled" : ""}">
      <a class="page-link" href="#" onclick="fetchJobs('${$("#startDate").val()}', '${$("#finishDate").val()}', ${currentPage + 1})">>></a>
    </li>
    <li class="page-item ${currentPage === totalPages ? "disabled" : ""}">
      <a class="page-link" href="#" onclick="fetchJobs('${$("#startDate").val()}', '${$("#finishDate").val()}', ${totalPages})">หน้าสุดท้าย</a>
    </li>`
  );

  $("#pagination-nav").show();
}

// Handle search button click
$("#search-btn").click(() => {
  const startDate = $("#startDate").val();
  const finishDate = $("#finishDate").val();
  fetchJobs(startDate, finishDate);
});

// Initialize with all transactions on page load
$(document).ready(async () => {
  await apiService.initConfig();

  await apiService.checkAuthentication();

  await fetchJobs();
});