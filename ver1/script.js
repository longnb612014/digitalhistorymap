const width = 320;
const height = 520;

const svg = d3.select("#map-wrapper")
    .append("svg")
    .attr("width", "100%")
    .attr("height", "100%")
    .attr("viewBox", `0 0 ${width} ${height}`)
    .attr("preserveAspectRatio", "xMidYMid meet");

const projection = d3.geoMercator()
    .center([106.5, 15.8])
    .scale(1850)
    .translate([width / 2-80, height / 2]);

const pathGenerator = d3.geoPath().projection(projection);

let historyData = {};

// Hàm chuẩn hóa tiếng Việt (giúp tìm kiếm "Hà Nội" hay "ha noi" đều ra)
function simplifiedStr(str) {
    if (!str) return "";
    return str.toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .trim();
}

// 1. Nạp dữ liệu
Promise.all([
    d3.json("vietnam.json"),
    d3.json("history.json")
]).then(([geoData, histData]) => {
    historyData = histData;

    // 2. Vẽ bản đồ
    svg.selectAll("path")
        .data(geoData.features)
        .enter()
        .append("path")
        .attr("d", pathGenerator)
        .attr("class", "province-path")
        .attr("id", d => d.id) 
        .on("click", function(event, d) {
            showInfo(d.id, this);
        });

    // 3. Xử lý nút tìm kiếm
    const searchBtn = document.getElementById("search-btn");
    const searchInput = document.getElementById("search-input");

    if (searchBtn) {
        searchBtn.onclick = function() {
            const val = simplifiedStr(searchInput.value);
            if (!val) return;

            // Tìm ID tỉnh dựa trên tên trong file history
            let foundId = Object.keys(historyData).find(key => {
                let nameInFile = simplifiedStr(historyData[key].name);
                return nameInFile.includes(val) || key.includes(val);
            });

            if (foundId) {
                const element = document.getElementById(foundId);
                showInfo(foundId, element);
            } else {
                alert("Không tìm thấy tỉnh: " + searchInput.value);
            }
        };
    }
    
    // Hỗ trợ nhấn Enter
    searchInput.onkeypress = (e) => { if (e.key === "Enter") searchBtn.click(); };

}).catch(err => console.error("Lỗi nạp file:", err));

// 4. Hàm hiển thị thông tin
function showInfo(id, element) {
    // Xóa active cũ, thêm active mới
    d3.selectAll(".province-path").classed("active", false);
    if (element) d3.select(element).classed("active", true);

    const data = historyData[id];
    const nameBox = document.getElementById("province-name");
    const historyBox = document.getElementById("province-history");

    if (data) {
        // Ẩn bài thơ, hiện thông tin vùng
        document.getElementById("default-info").style.display = "none";
        document.getElementById("region-info").style.display = "block";

        nameBox.innerText = data.name;
        let html = `<div class="timeline-container">`;
        data.events.forEach(ev => {
            html += `
                <div class="timeline-item">
                    <div class="timeline-year">${ev.year}</div>
                    <div class="timeline-content">
                        <h4>${ev.title}</h4>
                        <p>${ev.detail}</p>
                    </div>
                </div>`;
        });
        html += `</div>`;
        historyBox.innerHTML = html;
        
        // Tự động cuộn lên đầu bảng tin
        document.querySelector(".info-section").scrollTop = 0;
    }
}

// Hàm quay lại mặc định (nếu cần)
function showDefaultInfo() {
    document.getElementById("default-info").style.display = "block";
    document.getElementById("region-info").style.display = "none";
}
