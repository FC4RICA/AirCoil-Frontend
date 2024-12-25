class ApiService {
  constructor() {
    this.apiBaseURL = '';
    this.token = sessionStorage.getItem('bearerToken') || null;
  }

  async initConfig() {
    if (!this.apiBaseURL) {
      const config = await $.getJSON('../config/api.json');      
      this.apiBaseURL = config.baseURL;
    }
  }

  // Token handling method
  #setToken(token) {
    this.token = token;
    sessionStorage.setItem('bearerToken', token);
  }

  #removeToken(){
    this.token = null;
    sessionStorage.removeItem('bearerToken');
  }

  async login(username, password) {
    const response = await this.#request('/account/login', 'POST', { username, password });
    this.#setToken(response.token);
    return response;
  }

  logout() {
    this.#removeToken();
    window.location.replace('../');
  }

  async checkAuthentication() {
    try {
      await this.#request('/account/current', 'GET');
      return true
    } catch (error) {
      this.logout();
      console.error(error);
      
    }
    
  }
  
  async getCurrentUser() {
    return await this.#request('/account/current', 'GET');
  }

  async getProvinces() {
    return await this.#request('/provinces', 'GET');
  }

  async getCarModels() {
    const config = await $.getJSON('../config/api.json');      
    const brandId = config.brandId;
    return await this.#request(`/brands/${brandId}/models`, 'GET');
  }

  async getJobs({ startDate = '', endDate = '', pageNumber = 1, pageSize = 5, licensePlate = '', provinceId = '', modelId = '', isDescending = true }) {
    return await this.#request('/jobs', 'GET', null, {
      startDate, endDate, pageNumber, pageSize, isDescending, licensePlate, provinceId, modelId
    });
  }

  async getJob(id) {
    return await this.#request(`/jobs/${id}`, 'GET');
  }

  async getCar({ licensePlate = '', province = '' }) {
    return await this.#request('/cars', 'GET', null, { licensePlate, province });
  }

  async getJobsByCar(id, { pageNumber = 1, pageSize = 5, isDescending }) {
    return await this.#request(`/cars/${id}/jobs`, 'GET', null, { pageNumber, pageSize, isDescending });
  }

  async updateCar(id, carData) {
    return await this.#request(`/cars/${id}`, 'PATCH', carData);
  } 

  async createJob(image, jobData) {
    const formData = new FormData();
    formData.append('file', image);
    formData.append('Mileage', jobData.mileage);
    formData.append('Car.LicensePlate', jobData.licensePlate);
    formData.append('Car.ProvinceId', jobData.provinceId);
    formData.append('Car.ModelId', jobData.modelId);

    try {
      const response = await fetch(`${this.apiBaseURL}/jobs`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'ngrok-skip-browser-warning': true
        },
        body: formData
      });
      if (!response.ok) {
        throw new Error(`HTTP Error status: ${response.status}`)
      }
      return await response.json();
    } catch (error) {
      console.error(error);
    }
  }

  

  // General request method to handle API calls
  async #request(endpoint, method = 'GET', body = null, params = {}) {
    const url = new URL(`${this.apiBaseURL}${endpoint}`);
    
    if (params && method === 'GET') {
      Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
    }

    const options = {
      method,
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': true
      }
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(url, options);
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    if (response.status == 204) {
      return
    }

    return response.json();
  }
}