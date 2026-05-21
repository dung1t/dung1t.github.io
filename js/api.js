/**
 * Quant Trading API Client
 * Cung cấp các phương thức gọi API từ Datafeed IQ và Datafeed Trading
 */
class QuantAPIClient {
  constructor() {
    this.DATAFEED_IQ = "https://datafeed.quant.vn/vietcap/api/iq-insight-service/v1";
    this.DATAFEED_TRADING = "https://datafeed.quant.vn/trading/api";
  }

  /**
   * Helper chung để thực hiện fetch request
   */
  async #request(url, options = {}) {
    try {
      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API Request failed for ${url}:`, error);
      throw error;
    }
  }

  /**
   * 1. Lấy toàn bộ mã ICB (phân ngành của cổ phiếu)
   * @returns {Promise<any>} Danh sách mã phân ngành ICB
   */
  async getAllIcbCodes() {
    const url = `${this.DATAFEED_IQ}/sectors/icb-codes`;
    return this.#request(url);
  }

  /**
   * 2. Lấy dữ liệu kỹ thuật theo ngày của một mã cổ phiếu (ví dụ: FPT, HPG, SSI)
   * @param {string} instrument Mã cổ phiếu (ví dụ: 'FPT')
   * @returns {Promise<any>} Dữ liệu kỹ thuật chi tiết
   */
  async getCompanyTechnical(instrument) {
    if (!instrument) throw new Error("Instrument code is required");
    const upperInstrument = instrument.toUpperCase().trim();
    const url = `${this.DATAFEED_IQ}/company/${upperInstrument}/technical/ONE_DAY`;
    return this.#request(url);
  }

  /**
   * 3. Lấy xếp hạng ngành (Sector Ranking)
   * @returns {Promise<any>} Dữ liệu xếp hạng các phân ngành
   */
  async getSectorRanking() {
    const url = `${this.DATAFEED_IQ}/sector-ranking/sectors?icbLevel=4&adtv=1&value=3`;
    return this.#request(url);
  }

  /**
   * 4. Lấy thông tin chung của toàn bộ ngành
   * @returns {Promise<any>} Danh sách thông tin chi tiết các ngành
   */
  async getSectorInformation() {
    const url = `${this.DATAFEED_IQ}/sector-information?icbLevel=4`;
    return this.#request(url);
  }

  /**
   * 5. Lấy danh sách các công ty/mã cổ phiếu thuộc một ngành cụ thể
   * @param {string} icbCode Mã ngành ICB (ví dụ: '8350')
   * @returns {Promise<any>} Danh sách các công ty trong ngành
   */
  async getSectorCompanies(icbCode) {
    if (!icbCode) throw new Error("icbCode is required");
    const url = `${this.DATAFEED_IQ}/sector-information/${icbCode}/companies`;
    return this.#request(url);
  }

  /**
   * 6. Lấy top giá trị giao dịch ròng của khối ngoại (Foreign Net Value Top)
   * @returns {Promise<any>} Danh sách top mua ròng / bán ròng khối ngoại
   */
  async getForeignNetValueTop() {
    const url = `${this.DATAFEED_TRADING}/market-watch/v3/ForeignNetValue/top`;
    return this.#request(url);
  }

  /**
   * 7. Lấy dữ liệu biểu đồ khoảng cách thanh khoản (Gap Liquidity)
   * @returns {Promise<any>} Dữ liệu khoảng trống và thanh khoản thị trường
   */
  async getGapLiquidity() {
    const url = `${this.DATAFEED_TRADING}/chart/v3/OHLCChart/gap-liquidity`;
    return this.#request(url);
  }

  /**
   * 8. Lấy toàn bộ biểu đồ khối lượng giao dịch khối ngoại (Foreign Volume Chart)
   * @returns {Promise<any>} Dữ liệu biểu đồ khối lượng giao dịch khối ngoại
   */
  async getForeignVolumeChartAll() {
    const url = `${this.DATAFEED_TRADING}/market-watch/v3/ForeignVolumeChart/getAll`;
    return this.#request(url);
  }
}

// Khởi tạo một đối tượng toàn cục duy nhất
const QuantAPI = new QuantAPIClient();

// Hỗ trợ cả môi trường CommonJS (Node/Bundlers) và trình duyệt truyền thống
if (typeof module !== "undefined" && module.exports) {
  module.exports = QuantAPI;
} else if (typeof window !== "undefined") {
  window.QuantAPI = QuantAPI;
}
