const vietnamBounds = [[7.0, 102.0], [23.7, 116.0]];
const map = L.map('map', {
  center: [16.0, 107.0],
  zoom: 6,
  minZoom: 5,
  maxZoom: 8,
  maxBounds: vietnamBounds,
  maxBoundsViscosity: 1.0,
  zoomSnap: 0.5,
  zoomControl: true
});

map.fitBounds(vietnamBounds);

window.addEventListener('load', () => {
  setTimeout(() => {
    map.invalidateSize();
    map.fitBounds(vietnamBounds);
  }, 200);
});

const historyPeriods = [
  { key: 'thuong-co', label: 'Thượng cổ',                number: '①', years: 'Trước 179 TCN', color: '#7c5e1a',
    summary: 'Thời kỳ Văn Lang – Âu Lạc, nền văn minh Đông Sơn rực rỡ.' },
  { key: 'bac-thuoc', label: 'Bắc thuộc',                number: '②', years: '179 TCN – 938',  color: '#8b1a1a',
    summary: 'Hơn nghìn năm đô hộ phương Bắc, liên tục đấu tranh giành độc lập.' },
  { key: 'doc-lap',   label: 'Độc lập tự chủ',           number: '③', years: '938 – 1427',     color: '#1a6b3c',
    summary: 'Các triều Ngô, Đinh, Lý, Trần xây dựng Đại Việt hùng cường.' },
  { key: 'dai-viet',  label: 'Đại Việt thịnh trị',       number: '④', years: '1428 – 1802',    color: '#8b4513',
    summary: 'Nhà Lê sơ, chúa Nguyễn mở cõi Nam, Tây Sơn thống nhất đất nước.' },
  { key: 'can-dai',   label: 'Cận đại & Thực dân',       number: '⑤', years: '1802 – 1945',    color: '#2c5282',
    summary: 'Triều Nguyễn, thực dân Pháp xâm lược và phong trào giải phóng dân tộc.' },
  { key: 'hien-dai',  label: 'Kháng chiến & Thống nhất', number: '⑥', years: '1945 – nay',     color: '#c0392b',
    summary: 'Độc lập 1945, kháng chiến chống Mỹ, thống nhất 1975 và Đổi Mới 1986.' }
];

// Provinces outside Vietnamese territory in each period — greyed out on map
const historicalTerritory = {
  'thuong-co': ['Quảng Bình','Quảng Trị','Thừa Thiên Huế','Đà Nẵng','Quảng Nam',
    'Quảng Ngãi','Bình Định','Phú Yên','Khánh Hòa','Ninh Thuận','Bình Thuận',
    'Kon Tum','Gia Lai','Đắk Lắk','Đắk Nông','Lâm Đồng',
    'Bình Phước','Tây Ninh','Bình Dương','Đồng Nai','Bà Rịa - Vũng Tàu','Bà Rịa – Vũng Tàu',
    'Hồ Chí Minh','Long An','Tiền Giang','Bến Tre','Vĩnh Long','Trà Vinh',
    'Đồng Tháp','An Giang','Kiên Giang','Cần Thơ','Hậu Giang','Sóc Trăng','Bạc Liêu','Cà Mau'],
  'bac-thuoc': ['Quảng Bình','Quảng Trị','Thừa Thiên Huế','Đà Nẵng','Quảng Nam',
    'Quảng Ngãi','Bình Định','Phú Yên','Khánh Hòa','Ninh Thuận','Bình Thuận',
    'Kon Tum','Gia Lai','Đắk Lắk','Đắk Nông','Lâm Đồng',
    'Bình Phước','Tây Ninh','Bình Dương','Đồng Nai','Bà Rịa - Vũng Tàu','Bà Rịa – Vũng Tàu',
    'Hồ Chí Minh','Long An','Tiền Giang','Bến Tre','Vĩnh Long','Trà Vinh',
    'Đồng Tháp','An Giang','Kiên Giang','Cần Thơ','Hậu Giang','Sóc Trăng','Bạc Liêu','Cà Mau'],
  'doc-lap': ['Bình Định','Phú Yên','Khánh Hòa','Ninh Thuận','Bình Thuận',
    'Kon Tum','Gia Lai','Đắk Lắk','Đắk Nông','Lâm Đồng',
    'Bình Phước','Tây Ninh','Bình Dương','Đồng Nai','Bà Rịa - Vũng Tàu','Bà Rịa – Vũng Tàu',
    'Hồ Chí Minh','Long An','Tiền Giang','Bến Tre','Vĩnh Long','Trà Vinh',
    'Đồng Tháp','An Giang','Kiên Giang','Cần Thơ','Hậu Giang','Sóc Trăng','Bạc Liêu','Cà Mau'],
  'dai-viet': [], 'can-dai': [], 'hien-dai': []
};

function getContrastColor(hex) {
  const h = hex.replace('#','');
  const r = parseInt(h.substr(0,2),16), g = parseInt(h.substr(2,2),16), b = parseInt(h.substr(4,2),16);
  return (0.299*r + 0.587*g + 0.114*b)/255 > 0.5 ? '#1a0a00' : '#fffaf0';
}

const provinceInfo = {
  'Hà Nội': {
    population: '8.3 triệu',
    area: '3,324.92 km²',
    description: 'Thủ đô của Việt Nam, trung tâm chính trị, kinh tế và văn hóa.'
  },
  'Hồ Chí Minh': {
    population: '9.1 triệu',
    area: '2,095 km²',
    description: 'Thành phố lớn nhất Việt Nam, trung tâm kinh tế phía Nam.'
  },
  'Đà Nẵng': {
    population: '1.1 triệu',
    area: '1,285.4 km²',
    description: 'Thành phố trực thuộc trung ương, nằm ở miền Trung Việt Nam.'
  },
  'Cần Thơ': {
    population: '1.2 triệu',
    area: '1,401.6 km²',
    description: 'Thành phố trực thuộc trung ương, trung tâm của Đồng bằng sông Cửu Long.'
  },
  'Hải Phòng': {
    population: '2.0 triệu',
    area: '1,527.4 km²',
    description: 'Thành phố trực thuộc trung ương, cảng biển quan trọng.'
  }
};

// Sát nhập tỉnh thành chính thức 12/6/2025 (Nghị quyết Quốc hội)
// 63 tỉnh → 34 tỉnh thành. 11 tỉnh giữ nguyên, 52 tỉnh → 23 đơn vị mới.
// key = tên tỉnh sau sát nhập, value = các tỉnh bị hấp thụ vào
const mergerGroups = {
  // Đông Bắc – Tây Bắc
  'Lào Cai':      ['Yên Bái'],
  'Tuyên Quang':  ['Hà Giang'],
  'Thái Nguyên':  ['Bắc Kạn'],
  'Phú Thọ':      ['Vĩnh Phúc', 'Hòa Bình'],
  'Bắc Ninh':     ['Bắc Giang'],
  // Đồng bằng Sông Hồng
  'Hưng Yên':     ['Thái Bình'],
  'Hải Phòng':    ['Hải Dương'],
  'Ninh Bình':    ['Hà Nam', 'Nam Định'],
  // Bắc Trung Bộ
  'Quảng Trị':    ['Quảng Bình'],
  // Nam Trung Bộ – Tây Nguyên
  'Đà Nẵng':      ['Quảng Nam'],
  'Quảng Ngãi':   ['Kon Tum'],
  'Gia Lai':      ['Bình Định'],
  'Khánh Hòa':    ['Ninh Thuận'],
  'Đắk Lắk':     ['Phú Yên'],
  'Lâm Đồng':     ['Đắk Nông', 'Bình Thuận'],
  // Đông Nam Bộ
  'Hồ Chí Minh': ['Bà Rịa - Vũng Tàu', 'Bình Dương'],
  'Đồng Nai':     ['Bình Phước'],
  'Tây Ninh':     ['Long An'],
  // Đồng bằng Sông Cửu Long
  'Cần Thơ':      ['Sóc Trăng', 'Hậu Giang'],
  'Vĩnh Long':    ['Bến Tre', 'Trà Vinh'],
  'Đồng Tháp':    ['Tiền Giang'],
  'Cà Mau':       ['Bạc Liêu'],
  'An Giang':     ['Kiên Giang'],
};

const vietnamDynasties = {
  title: 'Các triều đại Việt Nam',
  description: 'Các triều đại chính trong lịch sử Việt Nam, từ các thời kỳ sơ khai đến triều Nguyễn.',
  events: [
    {
      year: '2879 TCN',
      title: 'Nhà nước Văn Lang ra đời',
      text: 'Hùng Vương dựng nước Văn Lang — nhà nước đầu tiên của người Việt với kinh đô Phong Châu (Phú Thọ).',
      detail: 'Theo truyền thuyết, Kinh Dương Vương và sau đó là các đời Hùng Vương đã lập nên nước Văn Lang vào khoảng năm 2879 TCN. Đây là nhà nước sơ khai đầu tiên của người Lạc Việt tại lưu vực sông Hồng, lấy nông nghiệp lúa nước làm gốc, hình thành truyền thống đoàn kết dân tộc và bản sắc văn hóa lâu đời của người Việt.'
    },
    {
      year: '700 TCN',
      title: 'Văn hóa Đông Sơn rực rỡ',
      text: 'Nền văn hóa Đông Sơn nở rộ với trống đồng tinh xảo, đỉnh cao văn minh đồng thau của người Lạc Việt.',
      detail: 'Văn hóa Đông Sơn (khoảng 700–200 TCN) là đỉnh cao của nền văn minh đồng thau Việt cổ. Trống đồng Đông Sơn với hoa văn mặt trời, chim Lạc và cảnh sinh hoạt cộng đồng phản ánh xã hội nông nghiệp phát triển, tín ngưỡng phồn thực và sức sáng tạo độc đáo của người Lạc Việt vùng đồng bằng sông Hồng.'
    },
    {
      year: '257 TCN',
      title: 'Nước Âu Lạc thành lập',
      text: 'Thục Phán An Dương Vương hợp nhất Lạc Việt và Âu Việt, lập nước Âu Lạc, xây thành Cổ Loa.',
      detail: 'Năm 257 TCN, Thục Phán An Dương Vương đánh bại vua Hùng thứ 18, sáp nhập người Âu Việt và Lạc Việt thành nước Âu Lạc. Ông xây thành Cổ Loa hình trôn ốc (Đông Anh, Hà Nội ngày nay) — công trình quân sự đặc sắc nhất Đông Nam Á cổ đại, thể hiện tài tổ chức và bảo vệ đất nước của người Việt cổ.'
    },
    {
      year: '179 TCN',
      title: 'Triệu Đà thôn tính Âu Lạc',
      text: 'Triệu Đà đánh bại An Dương Vương, sáp nhập Âu Lạc vào Nam Việt — mở đầu hơn nghìn năm Bắc thuộc.',
      detail: 'Năm 179 TCN, Triệu Đà lợi dụng nội loạn nước Âu Lạc, đánh bại An Dương Vương và sáp nhập lãnh thổ vào Nam Việt. Đây là sự kiện đánh dấu khởi đầu thời kỳ Bắc thuộc kéo dài hơn 1000 năm — giai đoạn thử thách bản lĩnh và ý chí quật cường của người Việt.'
    },
    {
      year: '40',
      title: 'Khởi nghĩa Hai Bà Trưng',
      text: 'Trưng Trắc và Trưng Nhị phất cờ khởi nghĩa, giành lại độc lập, làm chủ 65 thành trì trong 3 năm.',
      detail: 'Năm 40 SCN, hai chị em Trưng Trắc và Trưng Nhị lãnh đạo cuộc khởi nghĩa chống ách đô hộ nhà Hán, giải phóng 65 thành trì từ Mê Linh tới Cửu Chân. Trưng Trắc xưng vương, đóng đô ở Mê Linh (Vĩnh Phúc). Dù bị Mã Viện đàn áp vào năm 43, cuộc khởi nghĩa là ngọn lửa đầu tiên thắp sáng tinh thần chống Bắc thuộc của dân tộc Việt.'
    },
    {
      year: '248',
      title: 'Khởi nghĩa Bà Triệu',
      text: 'Triệu Thị Trinh cưỡi voi, mặc áo giáp vàng dẫn quân khởi nghĩa chống nhà Ngô ở Cửu Chân.',
      detail: 'Năm 248 SCN, Triệu Thị Trinh (Bà Triệu) lãnh đạo cuộc khởi nghĩa tại Thanh Hóa chống lại sự đô hộ của nhà Ngô. Bà nổi tiếng với câu nói: "Tôi muốn cưỡi cơn gió mạnh, đạp luồng sóng dữ, chém cá kình ở biển Đông, đánh đuổi quân Ngô giành lại giang sơn." Dù thất bại sau 6 tháng, hình ảnh Bà Triệu trở thành biểu tượng bất diệt của tinh thần độc lập người Việt.'
    },
    {
      year: '544',
      title: 'Lý Bí lập nước Vạn Xuân',
      text: 'Lý Bí đánh đuổi quân Lương, xưng Lý Nam Đế, lập nước Vạn Xuân — nhà nước tự chủ đầu tiên sau Bắc thuộc.',
      detail: 'Năm 544 SCN, Lý Bí khởi nghĩa đánh đuổi thứ sử nhà Lương, lập nước Vạn Xuân, xưng là Lý Nam Đế. Đây là lần đầu tiên người Việt thành công lập một nhà nước độc lập dài hơn — dù chỉ được 60 năm (544–602). Tên nước "Vạn Xuân" mang ước nguyện đất nước trường tồn muôn ngàn mùa xuân, thể hiện khát vọng độc lập sâu sắc của dân tộc.'
    },
    {
      year: '722',
      title: 'Khởi nghĩa Mai Thúc Loan',
      text: 'Mai Thúc Loan xưng là Mai Hắc Đế, lãnh đạo nhân dân ba châu nổi dậy chống ách đô hộ nhà Đường.',
      detail: 'Năm 722 SCN, Mai Thúc Loan tập hợp hàng vạn nghĩa quân từ Hoan Châu (Nghệ An), liên kết với Champa và Chân Lạp, đánh chiếm cả phủ đô hộ Tống Bình (Hà Nội). Ông xưng đế, được gọi là Mai Hắc Đế. Dù bị nhà Đường cử đại quân đàn áp, cuộc khởi nghĩa cho thấy sức mạnh quần chúng và khả năng tập hợp lực lượng của người Việt ở quy mô lớn.'
    },
    {
      year: '791',
      title: 'Phùng Hưng giành quyền tự chủ',
      text: 'Phùng Hưng (Bố Cái Đại Vương) đánh đuổi đô hộ nhà Đường, tự trị trong nhiều năm.',
      detail: 'Khoảng năm 791 SCN, Phùng Hưng khởi nghĩa tại Đường Lâm (Sơn Tây), vây đánh phủ đô hộ và tự trị trong nhiều năm. Nhân dân kính trọng gọi ông là "Bố Cái Đại Vương" (vua cha vua mẹ). Cuộc khởi nghĩa thể hiện sức sống mãnh liệt của tinh thần dân tộc, là bước chuẩn bị tinh thần và lực lượng cho chiến thắng Bạch Đằng lịch sử năm 938.'
    },
    {
      year: '968',
      title: 'Nhà Đinh - Tiền Lê',
      text: 'Đinh Tiên Hoàng và Lê Hoàn thiết lập nền độc lập chính quyền phong kiến Việt Nam, chấm dứt thống trị của Đường Tây.',
      detail: 'Đây là thời kỳ khởi đầu cho một chính quyền phong kiến thống nhất, với việc củng cố lãnh thổ, thiết lập trật tự hành chính và đặt nền móng cho một quốc gia có trung ương rõ ràng. Nó đánh dấu bước chuyển từ tình trạng phân tranh sang tập quyền quốc gia, đồng thời tạo tiền đề cho sự phát triển lâu dài về kinh tế, quân sự, giáo dục và văn hóa. Sự kiện này không chỉ có ý nghĩa chính trị mà còn là bước ngoặt làm cho ý thức quốc gia và bản sắc dân tộc được định hình rõ rệt hơn.'
    },
    {
      year: '1010',
      title: 'Nhà Lý',
      text: 'Lý Công Uẩn khai sinh triều đại Lý, xây dựng kinh đô Thăng Long và phát triển văn hóa, giáo dục.',
      detail: 'Nhà Lý là giai đoạn thịnh trị của Đại Việt, nơi Thăng Long trở thành trung tâm chính trị, văn hóa và tôn giáo của cả nước. Nền giáo dục, luật pháp, kiến trúc và đời sống xã hội thời Lý được hoàn thiện, tạo dấu ấn sâu đậm đến nhiều thế hệ sau. Đây là thời kỳ chứng minh sức mạnh của một nhà nước phong kiến ổn định, giàu bản sắc và có khả năng phát triển bền vững. Những giá trị văn hóa, tinh thần và tổ chức chính trị của thời Lý vẫn ảnh hưởng sâu đến đời sống Việt Nam sau này.'
    },
    {
      year: '1225',
      title: 'Nhà Trần',
      text: 'Nhà Trần bảo vệ đất nước trước quân Mông Cổ, củng cố quốc phòng và phát triển kinh tế.',
      detail: 'Nhà Trần nổi tiếng với ba lần chiến thắng trước quân xâm lược Mông Cổ, một thành tích hiếm có trong lịch sử châu Á. Bên cạnh chiến công quân sự, triều Trần còn xây dựng tinh thần đoàn kết dân tộc, khuyến khích nông nghiệp, bảo vệ kinh tế, phát triển giáo dục và giữ vững bản sắc quốc gia. Đây là giai đoạn thể hiện bản lĩnh, ý chí tự cường và tinh thần bất khuất của dân tộc Việt Nam, khi đất nước phải đối mặt với thử thách lớn nhưng vẫn đứng vững trước mọi thách thức.'
    },
    {
      year: '1428',
      title: 'Nhà Lê sơ',
      text: 'Lê Lợi dẹp giặc Minh, lập triều đại Lê với nhiều cải cách hành chính và phát triển kinh tế-xã hội.',
      detail: 'Nhà Lê sơ mở ra thời kỳ phục hưng sau chiến tranh, khi đất nước được ổn định sau nhiều năm rối ren và chiến loạn. Triều Lê thực hiện nhiều cải cách về hành chính, quân sự và đời sống xã hội, đồng thời khôi phục nông nghiệp, phát triển thương mại và củng cố trật tự quốc gia. Đây là một bước ngoặt quan trọng, giúp Việt Nam bước vào một giai đoạn phát triển bền vững, ổn định và phong phú hơn, đồng thời tạo nền tảng cho sự thịnh vượng lâu dài của đất nước.'
    },
    {
      year: '1802',
      title: 'Nhà Nguyễn',
      text: 'Gia Long thống nhất đất nước từ Bắc vào Nam, thành lập triều đại phong kiến cuối cùng của Việt Nam.',
      detail: 'Nhà Nguyễn là triều đại phong kiến cuối cùng, duy trì một hệ thống hành chính, quân sự và văn hóa khá hoàn chỉnh, đồng thời đặt ra nhiều quy chế quản lý đất nước trong thời kỳ cuối của chế độ phong kiến. Sự tồn tại của triều đại này để lại ảnh hưởng lớn đến cấu trúc chính trị, tín ngưỡng, kiến trúc và đời sống xã hội Việt Nam hiện nay, dù sau đó đất nước bước sang một thời kỳ mới với nhiều biến động và đổi thay. Đây là một giai đoạn có ý nghĩa lịch sử sâu sắc, vừa mang tính bảo tồn vừa chứa đựng những mầm mống chuyển mình.'
    }
  ]
};

const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const showIslandsButton = document.getElementById('show-islands-button');
const searchResult = document.getElementById('explore-result');
const imageModal = document.getElementById('image-modal');
const modalImage = document.getElementById('modal-image');
const closeImageModalButton = document.getElementById('close-image-modal');

function openImageModal(src, alt = 'Ảnh minh hoạ') {
  if (!imageModal || !modalImage) return;
  modalImage.src = src;
  modalImage.alt = alt;
  imageModal.hidden = false;
  document.body.classList.add('modal-open');
}

function closeImageModal() {
  if (!imageModal) return;
  imageModal.hidden = true;
  document.body.classList.remove('modal-open');
}

function attachIllustrationClickHandlers(root = document) {
  root.querySelectorAll('.event-illustration').forEach((card) => {
    if (card.dataset.lightboxBound) return;
    card.dataset.lightboxBound = 'true';
  });
}

if (closeImageModalButton) {
  closeImageModalButton.addEventListener('click', closeImageModal);
}

if (imageModal) {
  imageModal.addEventListener('click', (event) => {
    if (event.target === imageModal) closeImageModal();
  });
}

if (document.body) {
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && imageModal && !imageModal.hidden) {
      closeImageModal();
    }
  });
}

function prepareSpokenText(text) {
  return text
    .replace(/TCN/g, 'trước công nguyên')
    .replace(/SCN/g, 'sau công nguyên')
    .replace(/\bTK\b/g, 'thế kỷ')
    .replace(/\bTP\./g, 'thành phố ')
    .replace(/\bTW\b/g, 'trung ương')
    .replace(/\bVN\b/g, 'Việt Nam');
}

function speakEventDetail(text, btn) {
  if (!('speechSynthesis' in window) || !text) return;
  if (window.speechSynthesis.speaking) {
    window.speechSynthesis.cancel();
    document.querySelectorAll('.tl-speak-btn.speaking, .ep-speak-btn.speaking, .read-button.speaking')
      .forEach(b => b.classList.remove('speaking'));
    return;
  }
  const utterance = new SpeechSynthesisUtterance(prepareSpokenText(text));
  utterance.lang = 'vi-VN';
  utterance.rate = 1;
  if (btn) btn.classList.add('speaking');
  utterance.onend = () => {
    if (btn) btn.classList.remove('speaking');
  };
  window.speechSynthesis.speak(utterance);
}

const defaultProvinceStyle = {
  color: '#225ea8',
  weight: 1.8,
  opacity: 1,
  fillColor: '#4caf50',
  fillOpacity: 0.22
};

const highlightedProvinceStyle = {
  color: '#80311b',
  weight: 3,
  fillColor: '#c5281e',
  fillOpacity: 0.65
};

/* Explore-mode specific styles */
const exploreDefaultStyle = {
  color: '#5a9ab5',
  weight: 1.5,
  opacity: 1,
  fillColor: '#b0d4e8',
  fillOpacity: 0.65
};

const exploreClickStyle = {
  color: '#c94040',
  weight: 2.5,
  fillColor: '#f5c0c0',
  fillOpacity: 0.9
};

const mergeHighlightStyle = {
  color: '#b35a00',
  weight: 2.5,
  fillColor: '#ff9922',
  fillOpacity: 0.52,
  dashArray: '6 4'
};

let provinceLayers = {};
let islandMarkers = {};
let activeLayer = null;
let activeMergeLayers = [];
let regionDataStore = null;
let normalizedRegionDataKeys = {};
let periodProvinceMap = new Map();
let activeTimelinePeriod = 'doc-lap';
let currentTimelineData = vietnamDynasties;
let currentMode = 'home';
let jnGiaiDoan = 0;
let jnEventIndex = -1;
let jnEvents = [];
let jnPlaying = false;
let jnTimeout = null;
let jnSpeed = 3000;
let jnMarker = null;
let qzQuestions = [];
let qzIndex = 0;
let qzScore = 0;
let qzAnswered = false;
let qzAutoTimer = null;



const periodHighlightStyle = {
  color: '#8b1212',
  weight: 3,
  fillColor: '#f7c348',
  fillOpacity: 0.42
};

const mutedProvinceStyle = {
  color: 'rgba(38, 50, 56, 0.35)',
  weight: 1,
  fillColor: '#d6d1cb',
  fillOpacity: 0.12
};

const historyTimeline = document.getElementById('history-timeline');
const eraChip = document.getElementById('era-chip');
const eraSummary = document.getElementById('era-summary');

function findDataKeyForProvince(provinceName) {
  if (!regionDataStore) return null;
  const normalizedName = normalizeText(provinceName);
  if (normalizedRegionDataKeys[normalizedName]) {
    return normalizedRegionDataKeys[normalizedName];
  }
  const exactMatch = Object.keys(regionDataStore).find(key => normalizeText(key) === normalizedName);
  if (exactMatch) return exactMatch;
  return Object.keys(regionDataStore).find(key => {
    const normalizedKey = normalizeText(key);
    return normalizedKey === normalizedName || normalizedKey.includes(normalizedName) || normalizedName.includes(normalizedKey);
  }) || null;
}

function updateSearchResult(name, info) {
  const content = info
    ? `
      <h3>${name}</h3>
      <dl>
        <div><dt>Dân số</dt><dd>${info.population || 'Chưa cập nhật'}</dd></div>
        <div><dt>Diện tích</dt><dd>${info.area || 'Chưa cập nhật'}</dd></div>
        <div><dt>Mô tả</dt><dd>${info.description || 'Chưa có dữ liệu chi tiết.'}</dd></div>
      </dl>
    `
    : `
      <h3>Không tìm thấy kết quả</h3>
      <p>Vui lòng kiểm tra lại tên tỉnh thành hoặc thử một địa danh khác.</p>
    `;
  searchResult.innerHTML = content;
}

function parseYearValue(rawYear) {
  const value = String(rawYear || '').trim();
  const match = value.match(/-?\d+(?:\.\d+)?/);
  if (!match) return null;
  const number = Number(match[0]);
  return /tcn/i.test(value) ? -number : number;
}

function getPeriodKeyFromYear(rawYear) {
  const year = parseYearValue(rawYear);
  if (!Number.isFinite(year)) return null;
  if (year < -179) return 'thuong-co';
  if (year < 938)  return 'bac-thuoc';
  if (year < 1428) return 'doc-lap';
  if (year < 1802) return 'dai-viet';
  if (year < 1945) return 'can-dai';
  return 'hien-dai';
}

function getPeriodLabel(key) {
  return historyPeriods.find(item => item.key === key)?.label || 'Toàn bộ lịch sử';
}

function getPeriodSummary(key) {
  return historyPeriods.find(item => item.key === key)?.summary || 'Bản đồ đang hiển thị toàn bộ các tỉnh và sự kiện nổi bật.';
}

function buildPeriodProvinceMap() {
  periodProvinceMap = new Map();
  const sources = [
    ...(regionDataStore ? Object.values(regionDataStore) : []),
    vietnamDynasties
  ];

  sources.forEach(source => {
    const events = Array.isArray(source?.events) ? source.events : [];
    (source?.provinces || []).forEach(name => {
      events.forEach(evt => {
        const periodKey = getPeriodKeyFromYear(evt.year);
        if (!periodKey) return;
        if (!periodProvinceMap.has(periodKey)) {
          periodProvinceMap.set(periodKey, new Set());
        }
        periodProvinceMap.get(periodKey).add(name);
      });
    });
  });
}

function applyTimelineFilter(periodKey = activeTimelinePeriod) {
  activeTimelinePeriod = periodKey;

  const period = historyPeriods.find(p => p.key === periodKey);
  const periodColor = period?.color || '#4caf50';

  // Update tl-period-btn active styles
  document.querySelectorAll('.tl-period-btn').forEach(btn => {
    const isActive = btn.dataset.era === periodKey;
    btn.classList.toggle('tl-active', isActive);
    btn.style.background = isActive ? periodColor : '';
    btn.style.color = isActive ? getContrastColor(periodColor) : '';
    btn.style.borderColor = isActive ? 'transparent' : '';
  });

  if (currentMode !== 'timeline') {
    // Simple highlight/mute for journey & quiz modes
    const selectedSet = periodProvinceMap.get(periodKey) || new Set();
    Object.entries(provinceLayers).forEach(([name, layer]) => {
      if (activeLayer === name) { layer.setStyle(highlightedProvinceStyle); return; }
      layer.setStyle(selectedSet.has(name) ? periodHighlightStyle : mutedProvinceStyle);
    });
    return;
  }

  // ── Timeline mode: gradient coloring + territory masking ──
  const outsideNorm = (historicalTerritory[periodKey] || []).map(n => normalizeText(n));

  // Count events per province
  const provinceCounts = {};
  if (regionDataStore) {
    Object.values(regionDataStore).forEach(regionData => {
      (regionData.provinces || []).forEach(pName => {
        (regionData.events || []).forEach(evt => {
          if (getPeriodKeyFromYear(evt.year) === periodKey) {
            provinceCounts[pName] = (provinceCounts[pName] || 0) + 1;
          }
        });
      });
    });
  }
  const vals = Object.values(provinceCounts);
  const maxCount = vals.length ? Math.max(...vals) : 1;

  Object.entries(provinceLayers).forEach(([name, layer]) => {
    if (outsideNorm.includes(normalizeText(name))) {
      layer.setStyle({ color: '#c0bdb8', weight: 0.5, fillColor: '#d8d4ce', fillOpacity: 0.12 });
      return;
    }
    const count = provinceCounts[name] || 0;
    if (count === 0) {
      // Inside territory but no specific events: light period color (not grey)
      layer.setStyle({ color: periodColor, weight: 1, fillColor: periodColor, fillOpacity: 0.18 });
    } else {
      const fillOpacity = 0.22 + (count / maxCount) * 0.60;
      layer.setStyle({ color: periodColor, weight: 1.5, fillColor: periodColor, fillOpacity });
    }
  });

  // Update legend swatches color
  document.querySelectorAll('#tl-legend-swatches span').forEach((s, i) => {
    s.style.background = periodColor;
    s.style.opacity = String(0.2 + (i / 4) * 0.65);
  });

  // Update panel header text
  const titleEl = document.getElementById('tl-period-title');
  const yearsEl = document.getElementById('tl-period-years');
  if (titleEl) { titleEl.textContent = period?.label || ''; titleEl.style.color = periodColor; }
  if (yearsEl) { yearsEl.textContent = period?.years || ''; yearsEl.style.color = periodColor; }
}

function clearHighlight() {
  activeMergeLayers.forEach(n => {
    const l = provinceLayers[n];
    if (l) l.setStyle(currentMode === 'explore' ? exploreDefaultStyle : defaultProvinceStyle);
  });
  activeMergeLayers = [];

  if (!activeLayer) return;
  const layer = provinceLayers[activeLayer];
  activeLayer = null;
  if (!layer) return;
  if (currentMode === 'explore') {
    layer.setStyle(exploreDefaultStyle);
  } else {
    layer.setStyle(defaultProvinceStyle);
  }
}

function normalizeText(value) {
  return value
    .toString()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[\s–—_-]+/g, ' ')
    .replace(/[^\w\s]/g, '')
    .trim();
}

function getMergerInfo(provinceName) {
  const norm = normalizeText(provinceName);
  for (const [primary, members] of Object.entries(mergerGroups)) {
    if (normalizeText(primary) === norm) return { primary, members };
    if (members.some(m => normalizeText(m) === norm)) return { primary, members };
  }
  return null;
}

function buildMergeBanner(mergeInfo, clickedName) {
  if (!mergeInfo) return '';
  const style = 'margin:8px 0 0;padding:9px 12px;background:linear-gradient(135deg,#fff3e0,#ffe0b2);border-left:4px solid #ff9922;border-radius:6px;font-size:0.83rem;color:#7c4000;display:flex;flex-direction:column;gap:3px;';
  const noteStyle = 'font-size:0.75rem;opacity:0.72;';
  const isPrimary = normalizeText(mergeInfo.primary) === normalizeText(clickedName);
  if (isPrimary) {
    return `<div style="${style}">
      <span>🔄 <strong>Sau sát nhập 2025:</strong> ${mergeInfo.members.join(' + ')} sát nhập vào đây</span>
      <span style="${noteStyle}">Các tỉnh sát nhập được tô màu cam trên bản đồ</span>
    </div>`;
  } else {
    return `<div style="${style}">
      <span>🔄 <strong>Sau sát nhập 2025:</strong> Tỉnh này sát nhập vào <strong>${mergeInfo.primary}</strong></span>
      <span style="${noteStyle}">Bấm vào ${mergeInfo.primary} trên bản đồ để xem thông tin tỉnh mới</span>
    </div>`;
  }
}

function highlightProvince(name) {
  clearHighlight();
  // Tô màu chính cho tỉnh được bấm
  const layer = provinceLayers[name];
  if (!layer) return;
  layer.setStyle(currentMode === 'explore' ? exploreClickStyle : highlightedProvinceStyle);
  activeLayer = name;

  // Tô màu cam cho tất cả tỉnh khác trong cùng nhóm sát nhập
  const mergeInfo = getMergerInfo(name);
  if (mergeInfo) {
    [mergeInfo.primary, ...mergeInfo.members].forEach(relName => {
      if (normalizeText(relName) === normalizeText(name)) return;
      const entry = Object.entries(provinceLayers).find(([k]) =>
        normalizeText(k) === normalizeText(relName)
      );
      if (entry) {
        const [layerKey, relLayer] = entry;
        relLayer.setStyle(mergeHighlightStyle);
        activeMergeLayers.push(layerKey);
      }
    });
  }

  if (currentMode === 'explore') {
    map.flyToBounds(layer.getBounds(), { maxZoom: 9, padding: [30, 30] });
  } else {
    map.fitBounds(layer.getBounds(), { maxZoom: 8, padding: [40, 40] });
  }
}

function searchProvince() {
  const query = searchInput.value.trim();
  clearSearchError();
  if (!query) {
    clearHighlight();
    return;
  }

  const normalizedQuery = normalizeText(query);
  const isVietnamDynastyQuery = normalizedQuery === 'viet nam' || normalizedQuery === 'vietnam';
  if (isVietnamDynastyQuery) {
    currentTimelineData = vietnamDynasties;
    renderTimeline(vietnamDynasties, activeTimelinePeriod);
    clearHighlight();
    return;
  }

  const foundProvince = Object.keys(provinceLayers).find(name =>
    normalizeText(name).includes(normalizedQuery)
  );
  const foundDataKey = regionDataStore && Object.keys(regionDataStore).find(name =>
    normalizeText(name).includes(normalizedQuery)
  );
  const foundIsland = Object.keys(islandInfo).find(name =>
    normalizeText(name).includes(normalizedQuery)
  );
  const isAllIslandsQuery = /đảo|hòn đảo|các đảo|tất cả đảo|tất cả hòn đảo/.test(normalizedQuery);

  if (isAllIslandsQuery) {
    showAllIslands();
    return;
  }

  if (foundProvince || foundDataKey) {
    const mergeInfo = foundProvince ? getMergerInfo(foundProvince) : null;
    const dataKey = foundDataKey || foundProvince;
    const regionData = regionDataStore && regionDataStore[dataKey];
    if (regionData) {
      currentTimelineData = regionData;
      if (currentMode === 'explore') {
        renderExplorePanel(regionData, mergeInfo, foundProvince);
      } else {
        renderTimeline(regionData, activeTimelinePeriod);
      }
    } else {
      const info = provinceInfo[foundProvince] || {};
      if (currentMode === 'explore') {
        renderExploreFallback(foundProvince || dataKey, info, mergeInfo, foundProvince);
      } else {
        updateSearchResult(foundProvince || dataKey, info);
      }
    }
    if (foundProvince) {
      highlightProvince(foundProvince);
    } else {
      clearHighlight();
    }
  } else if (foundIsland) {
    const island = islandInfo[foundIsland];
    updateSearchResult(foundIsland, island);
    highlightIsland(foundIsland);
  } else {
    showSearchError(`Không tìm thấy "${query}". Hãy thử tên khác.`);
    clearHighlight();
    resetIslandStyles();
  }
}

searchButton.addEventListener('click', searchProvince);
if (showIslandsButton) {
  showIslandsButton.addEventListener('click', showAllIslands);
}
searchInput.addEventListener('keydown', event => {
  if (event.key === 'Enter') {
    event.preventDefault();
    searchProvince();
  }
});

fetch('https://raw.githubusercontent.com/trananhvinh/vietnam-geojson/master/geoBoundaries-VNM-ADM1_simplified.geojson')
  .then(response => response.json())
  .then(data => {
    L.geoJSON(data, {
      style: currentMode === 'explore' ? exploreDefaultStyle : defaultProvinceStyle,
      onEachFeature: function(feature, layer) {
        const name = feature.properties.shapeName;
        provinceLayers[name] = layer;
        const info = provinceInfo[name] || {};
        layer.bindTooltip(name, { sticky: true, direction: 'auto', className: 'ep-tooltip' });
        layer.on('mouseover', () => {
          if (currentMode === 'explore' && activeLayer !== name) {
            layer.setStyle({ fillOpacity: 0.85 });
          }
        });
        layer.on('mouseout', () => {
          if (currentMode === 'explore' && activeLayer !== name) {
            layer.setStyle({ fillOpacity: 0.65 });
          }
        });
        layer.on('click', () => {
          if (currentMode === 'quiz') {
            handleQuizMapClick(name);
            return;
          }
          const mergeInfo = getMergerInfo(name);
          const normalizedName = normalizeText(name);
          const dataKey = normalizedRegionDataKeys[normalizedName] || findDataKeyForProvince(name);
          if (currentMode === 'explore') {
            clearSearchError();
            const regionData = dataKey && regionDataStore && regionDataStore[dataKey];
            if (regionData) {
              renderExplorePanel(regionData, mergeInfo, name);
            } else {
              renderExploreFallback(name, info, mergeInfo, name);
            }
            highlightProvince(name);
          } else if (currentMode === 'timeline') {
            highlightProvince(name);
          } else {
            highlightProvince(name);
          }
        });
      }
    }).addTo(map);

    buildPeriodProvinceMap();
    if (currentMode === 'explore') {
      Object.values(provinceLayers).forEach(l => l.setStyle(exploreDefaultStyle));
      if (regionDataStore && !activeLayer) initExploreDefault();
    } else if (currentMode === 'home') {
      Object.values(provinceLayers).forEach(l => l.setStyle(defaultProvinceStyle));
    } else {
      applyTimelineFilter(activeTimelinePeriod);
    }
  })
  .catch(error => {
    console.error('Error loading GeoJSON:', error);
    searchResult.innerHTML = `
      <h3>Lỗi tải bản đồ</h3>
      <p>Không thể tải dữ liệu địa lý. Vui lòng kiểm tra kết nối hoặc thử lại sau.</p>
    `;
  });

function normalizeForImage(value = '') {
  return value
    .toString()
    .normalize('NFD')
    .replace(/[\u0000-\u001f]/g, '')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'd')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function getEventIllustrationSrc(title = '') {
  const t = normalizeForImage(title);
  const wiki = (f) => `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(f)}`;

  // ── Explicit event-title matches (verified, no duplicates) ─
  const exactMap = {
    // Thượng cổ
    'nha nuoc van lang ra doi':                           wiki('Suoi Tien, den tho Vua Hung - panoramio.jpg'),
    'van hoa dong son ruc ro':                            wiki('Trống đồng Đông Sơn Việt Nam Dong Son Drum.png'),
    'nuoc au lac thanh lap':                              wiki('Thanh co loa2.jpg'),
    // Bắc thuộc
    'khoi nghia hai ba trung':                            wiki('Hai ba trung Dong Ho painting.jpg'),
    'khoi nghia ba trieu':                                wiki('TuongBaTrieu.jpg'),
    'phung hung gianh quyen tu chu':                      wiki('TuongPhungHung.jpg'),
    // Hà Nội
    'kinh do thang long duoc thanh lap':                  wiki('Central Sector of the Imperial Citadel of Thang Long - Hanoi.jpg'),
    'van mieu quoc tu giam duoc xay dung':                wiki('Van Mieu - Quoc Tu Giam - Hanoi.jpg'),
    'khoi nghia lam son bung no':                         wiki('Khoi nghia lam son 500 01 (1) (Copy).jpg'),
    // TP.HCM
    'gia dinh chinh thuc tro thanh do thanh':             wiki('Ho Chi Minh City, Notre-Dame Basilica, 2020-01 CN-01.jpg'),
    // Đà Nẵng
    'da nang tro thanh mot phan cua dai viet':            wiki('Da Nang Bay 1.jpg'),
    'da nang len thanh pho truc thuoc trung uong':        wiki('Han River Bridge, Da Nang, 20241209, Ansicht01.jpeg'),
    // Hải Phòng
    'cang hai phong duoc xay dung':                       wiki('Container Ship at the Hai Phong International Container Terminal 01.jpg'),
    // Huế
    'hue tro thanh kinh do trieu nguyen':                 wiki('Vietnam, Hue, Imperial City of Hue, Gate.jpg'),
    'tong tien cong tet mau than tai hue':                wiki('Vietnam, Hue, Imperial City of Hue, Enclosure.jpg'),
    'di san hue duoc unesco cong nhan':                   wiki('Vietnam, Hue, Imperial City of Hue, Inner grounds.jpg'),
    // Ninh Bình
    'ninh binh tro thanh trung tam dat nuoc dai co viet': wiki('Codohoalu2010k1.jpg'),
    'trang an cua ninh binh duoc unesco cong nhan':       wiki('Trang An Landscape Complex, Ninh Binh Province, Vietnam, 20240202 1456 5313.jpg'),
    // Quảng Ninh
    'vinh ha long duoc unesco cong nhan':                 wiki('Halong Bay in Vietnam.jpg'),
    // Bến Tre
    'phong trao dong khoi bung no o ben tre':             wiki('Phong trào Đồng khởi.webp'),
    // Quảng Trị
    'quang tri la chien truong ac liet':                  wiki('Thành cổ Quảng Trị.JPG'),
    // Điện Biên
    'chien thang dien bien phu':                          wiki('Victory in Battle of Dien Bien Phu.jpg'),
    // An Giang
    'thanh lap tinh an giang':                            wiki('Vietnam, Chau Doc, Sam Mountain at Sunset.jpg'),
    'chien tranh bien gioi tay nam tai an giang':         wiki('Vietnam, Panorama of Chau Doc.jpg'),
    // Bà Rịa – Vũng Tàu
    'ba ria vung tau tro thanh vung bien chien luoc cua phap': wiki('Hải đăng Vũng Tàu.JPG'),
  };
  if (exactMap[t]) return exactMap[t];

  return null;
}

const islandInfo = {
  'Hoàng Sa': {
    population: 'Khoảng 1,500 km²',
    area: '1,500 km²',
    description: 'Quần đảo Hoàng Sa, một phần lãnh thổ của Việt Nam trên Biển Đông.'
  },
  'Trường Sa': {
    population: 'Khoảng 1,300 km²',
    area: '1,300 km²',
    description: 'Quần đảo Trường Sa, nằm ở phía Nam Biển Đông, có giá trị chiến lược cao.'
  },
  'Phú Quốc': {
    population: 'Khoảng 179 km²',
    area: '179 km²',
    description: 'Đảo Phú Quốc thuộc tỉnh Kiên Giang, nổi tiếng với du lịch biển và vườn quốc gia.'
  }
};

const islands = [
  { name: 'Hoàng Sa', coords: [16.5, 112.2] },
  { name: 'Trường Sa', coords: [9.7, 115.5] },
  { name: 'Phú Quốc', coords: [10.25, 103.95] }
];

const islandBounds = L.latLngBounds(islands.map(i => i.coords));

islands.forEach(island => {
  const marker = L.circleMarker(island.coords, {
    radius: 12,
    fillColor: 'transparent',
    color: 'transparent',
    weight: 0,
    opacity: 0,
    fillOpacity: 0
  })
    .bindPopup(`<strong>${island.name}</strong><br>Quần đảo lịch sử của Việt Nam.`)
    .addTo(map);
  marker.on('click', () => {
    if (currentMode === 'explore') {
      updateSearchResult(island.name, islandInfo[island.name]);
    }
    highlightIsland(island.name);
  });
  islandMarkers[island.name] = marker;
});

function showAllIslands() {
  const content = `
    <h3>Danh sách hòn đảo</h3>
    <dl>
      <div><dt>Hoàng Sa</dt><dd>${islandInfo['Hoàng Sa'].description}</dd></div>
      <div><dt>Trường Sa</dt><dd>${islandInfo['Trường Sa'].description}</dd></div>
      <div><dt>Phú Quốc</dt><dd>${islandInfo['Phú Quốc'].description}</dd></div>
    </dl>
  `;
  searchResult.innerHTML = content;
  highlightAllIslands();
  map.fitBounds(islandBounds, { padding: [40, 40], maxZoom: 6 });
}

function highlightIsland(name) {
  if (!islandMarkers[name]) return;
  resetIslandStyles();
  islandMarkers[name].setStyle({
    color: '#8b1212',
    weight: 4,
    fillOpacity: 1
  });
  islandMarkers[name].openPopup();
  map.setView(islandMarkers[name].getLatLng(), 7);
}

function resetIslandStyles() {
  Object.values(islandMarkers).forEach(marker => {
    marker.setStyle({
      color: '#a23d21',
      weight: 2,
      fillOpacity: 0.9
    });
  });
}

function highlightAllIslands() {
  resetIslandStyles();
  Object.values(islandMarkers).forEach(marker => {
    marker.setStyle({
      color: '#80311b',
      weight: 4,
      fillOpacity: 1
    });
  });
}

function renderTimeline(data, periodKey = activeTimelinePeriod, container = null) {
  currentTimelineData = data || currentTimelineData || vietnamDynasties;
  if (!container) {
    container = (currentMode === 'explore' || currentMode === 'home')
      ? document.getElementById('explore-result')
      : document.getElementById('timeline-events');
  }
  if (!container) return;
  container.innerHTML = '';

  const title = document.createElement('h1');
  title.className = 'region-title';
  const normalizedTitle = (data.title || '').replace(/^Vùng\s+/i, '');
  title.textContent = normalizedTitle || data.title || '';
  container.appendChild(title);

  if (data.description) {
    const meta = document.createElement('div');
    meta.className = 'region-meta';
    meta.textContent = data.description;
    container.appendChild(meta);
  }

  if (Array.isArray(data.sections) && data.sections.length) {
    const sections = document.createElement('div');
    sections.className = 'region-sections';
    data.sections
      .filter(section => {
        const title = (section.title || '').trim().toLowerCase();
        return title !== 'vai trò lịch sử' && title !== 'đặc trưng văn hóa';
      })
      .forEach(section => {
        const card = document.createElement('div');
        card.className = 'section-card';
        let html = `<h3>${section.title}</h3>`;
        if (Array.isArray(section.content)) {
          html += section.content.map(line => `<p>${line}</p>`).join('');
        } else if (section.content) {
          html += `<p>${section.content}</p>`;
        }
        if (Array.isArray(section.points) && section.points.length) {
          html += '<ul>' + section.points.map(point => `<li>${point}</li>`).join('') + '</ul>';
        }
        card.innerHTML = html;
        sections.appendChild(card);
      });
    if (sections.childElementCount) {
      container.appendChild(sections);
    }
  }

  const filteredEvents = (currentTimelineData.events || []).filter(evt => {
    if (!periodKey || periodKey === 'all') return true;
    return getPeriodKeyFromYear(evt.year) === periodKey;
  });

  if (!filteredEvents.length) {
    const emptyState = document.createElement('p');
    emptyState.className = 'timeline-empty';
    emptyState.textContent = 'Không có sự kiện nổi bật cho giai đoạn này. Hãy chọn một mốc thời gian khác.';
    container.appendChild(emptyState);
    return;
  }

  const timeline = document.createElement('div');
  timeline.className = 'timeline';
  filteredEvents.forEach((evt, idx) => {
    const item = document.createElement('div');
    item.className = 'timeline-item hidden';
    item.style.setProperty('--i', idx);
    item.tabIndex = 0;
    const summaryText = evt.text || '';
    const detailText = evt.detail || '';
    item.innerHTML = `
      <div class="timeline-year-row">
        <div class="timeline-year" role="button" tabindex="0" aria-label="Xem chi tiết sự kiện ${evt.title}">${evt.year}</div>
        <button type="button" class="read-button" aria-label="Đọc chi tiết sự kiện ${evt.title}" title="Đọc chi tiết sự kiện">🔊</button>
      </div>
      <div class="timeline-content">
        <h4>${evt.title}</h4>
        ${summaryText ? `<p>${summaryText}</p>` : ''}
        ${getEventIllustrationSrc(evt.title) ? `<div class="event-illustration" aria-hidden="true">
          <img src="${getEventIllustrationSrc(evt.title)}" alt="Hình ảnh minh hoạ sự kiện ${evt.title}">
        </div>` : ''}
        ${detailText && detailText !== summaryText ? `<p class="event-detail">${detailText}</p>` : ''}
      </div>
    `;
    const toggleExpanded = () => {
      const expanded = item.classList.toggle('expanded');
      item.setAttribute('aria-expanded', expanded ? 'true' : 'false');
    };
    const yearButton = item.querySelector('.timeline-year');
    const readButton = item.querySelector('.read-button');
    yearButton.addEventListener('click', (event) => {
      event.stopPropagation();
      toggleExpanded();
    });
    readButton.addEventListener('click', (event) => {
      event.stopPropagation();
      speakEventDetail(detailText || summaryText || evt.title);
    });
    yearButton.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        event.stopPropagation();
        toggleExpanded();
      }
    });
    timeline.appendChild(item);
  });
  container.appendChild(timeline);

  // trigger staggered reveal for dynamic items
  requestAnimationFrame(() => {
    timeline.querySelectorAll('.timeline-item.hidden').forEach(item => item.classList.remove('hidden'));
  });

  attachIllustrationClickHandlers(container);
}

function attachStaticTimelineToggles() {
  attachIllustrationClickHandlers(document);
  document.querySelectorAll('.timeline-item').forEach(item => {
    if (item._toggleAttached) return;
    item._toggleAttached = true;
    item.tabIndex = 0;

    const yearButton = item.querySelector('.timeline-year');
    if (yearButton) {
      yearButton.addEventListener('click', (event) => {
        event.stopPropagation();
        item.classList.toggle('expanded');
      });
      yearButton.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          e.stopPropagation();
          item.classList.toggle('expanded');
        }
      });
    }

    const readButton = item.querySelector('.read-button');
    if (readButton) {
      readButton.addEventListener('click', (event) => {
        event.stopPropagation();
        const text = item.querySelector('.event-detail')?.textContent
          || item.querySelector('.timeline-content p')?.textContent
          || item.querySelector('.timeline-content h4')?.textContent;
        speakEventDetail(text);
      });
    }
  });
}


// Try to load region data from a JSON file (fallback: leave existing HTML)
function loadRegionData(path = 'data.json') {
  fetch(path)
    .then(resp => {
      if (!resp.ok) throw new Error('No region JSON');
      return resp.json();
    })
    .then(data => {
      regionDataStore = data;
      normalizedRegionDataKeys = {};
      Object.keys(data).forEach(key => {
        normalizedRegionDataKeys[normalizeText(key)] = key;
      });
      buildPeriodProvinceMap();
      if (currentMode === 'timeline') {
        applyTimelineFilter(activeTimelinePeriod);
      } else if (currentMode === 'explore') {
        initExploreDefault();
      } else if (currentMode === 'journey') {
        selectJourneyPeriod(jnGiaiDoan);
      }
    })
    .catch(() => {
      // no-op: keep inline sample items if JSON not present
    });
}

// Load region data immediately (non-blocking)
loadRegionData();

if (historyTimeline) {
  historyTimeline.addEventListener('input', (event) => {
    const index = Number(event.target.value);
    const periodKey = historyPeriods[index]?.key || 'doc-lap';
    applyTimelineFilter(periodKey);
  });
}

// Clicking anywhere on the page will replay the timeline reveal if present
document.addEventListener('click', (ev) => {
  const timeline = document.querySelector('.timeline');
  if (!timeline) return;
  timeline.classList.remove('stagger');
  void timeline.offsetWidth;
  timeline.classList.add('stagger');
});

// Attach toggle behavior to any static HTML timeline items that exist on page load
requestAnimationFrame(attachStaticTimelineToggles);

/* ═══════════════════════════════════════════════════════
   MODE SWITCHING
═══════════════════════════════════════════════════════ */
function switchMode(mode) {
  currentMode = mode;
  window.speechSynthesis.cancel();
  document.querySelectorAll('.tl-speak-btn.speaking, .ep-speak-btn.speaking, .read-button.speaking')
    .forEach(b => b.classList.remove('speaking'));
  map.closePopup();
  map.flyToBounds(vietnamBounds, { duration: 0.8, padding: [20, 20] });
  if (mode !== 'journey') {
    pauseJourney();
    const yearEl = document.getElementById('jn-year-display');
    if (yearEl) yearEl.style.display = 'none';
  }

  document.querySelectorAll('.mode-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.mode === mode);
  });
  document.querySelectorAll('.mode-panel').forEach(p => {
    p.classList.toggle('active', p.id === `panel-${mode}`);
  });

  switch (mode) {
    case 'home':
      Object.values(provinceLayers).forEach(l => l.setStyle(defaultProvinceStyle));
      resetIslandStyles();
      activeLayer = null;
      map.fitBounds(vietnamBounds);
      break;

    case 'explore':
      Object.values(provinceLayers).forEach(l => l.setStyle(exploreDefaultStyle));
      resetIslandStyles();
      clearHighlight();
      initExploreDefault();
      break;

    case 'timeline':
      clearHighlight();
      map.fitBounds(vietnamBounds);
      applyTimelineFilter(activeTimelinePeriod);
      renderEraEvents(activeTimelinePeriod);
      break;

    case 'journey':
      selectJourneyPeriod(jnGiaiDoan);
      break;

    case 'quiz':
      Object.values(provinceLayers).forEach(l => l.setStyle(defaultProvinceStyle));
      resetIslandStyles();
      activeLayer = null;
      map.fitBounds(vietnamBounds);
      initQuiz();
      break;
  }
}

document.querySelectorAll('.mode-btn').forEach(btn => {
  btn.addEventListener('click', () => switchMode(btn.dataset.mode));
});

/* ═══════════════════════════════════════════════════════
   PANEL 2 – TIMELINE: Era events
═══════════════════════════════════════════════════════ */
function renderEraEvents(periodKey) {
  const container = document.getElementById('timeline-events');
  if (!container) return;

  const period = historyPeriods.find(p => p.key === periodKey);
  const periodColor = period?.color || '#4caf50';

  // Gather all events for this period
  const allEvents = [];
  (vietnamDynasties.events || []).forEach(evt => {
    if (getPeriodKeyFromYear(evt.year) === periodKey)
      allEvents.push({ ...evt, region: 'Toàn quốc', provinceName: null });
  });
  if (regionDataStore) {
    Object.entries(regionDataStore).forEach(([regionKey, data]) => {
      const provinces = data.provinces || [];
      (data.events || []).forEach(evt => {
        if (getPeriodKeyFromYear(evt.year) === periodKey) {
          allEvents.push({
            ...evt,
            region: regionKey.replace(/^Vùng\s+/i, ''),
            provinceName: provinces[0] || null
          });
        }
      });
    });
  }
  allEvents.sort((a, b) => (parseYearValue(a.year) || 0) - (parseYearValue(b.year) || 0));

  // Deduplicate: events with same title appearing in many provinces → show once as "Toàn quốc"
  const titleCount = {};
  allEvents.forEach(e => { const k = normalizeText(e.title); titleCount[k] = (titleCount[k] || 0) + 1; });
  const seenTitles = new Set();
  const dedupedEvents = allEvents.filter(e => {
    const k = normalizeText(e.title);
    if (titleCount[k] > 2) {
      if (seenTitles.has(k)) return false;
      seenTitles.add(k);
      e.region = 'Toàn quốc';
      e.provinceName = null;
    }
    return true;
  });

  // Update event count badge
  const countEl = document.getElementById('tl-event-count');
  if (countEl) countEl.textContent = dedupedEvents.length;

  container.innerHTML = '';
  if (!dedupedEvents.length) {
    const empty = document.createElement('p');
    empty.className = 'tl-empty';
    empty.textContent = 'Không có sự kiện nổi bật cho giai đoạn này.';
    container.appendChild(empty);
    return;
  }

  dedupedEvents.forEach(evt => {
    const item = document.createElement('div');
    item.className = 'tl-event-item';

    const imgSrc = getEventIllustrationSrc(evt.title);
    const detailText = (evt.detail && evt.detail !== evt.text) ? evt.detail : (evt.text || '');

    item.innerHTML = `
      <div class="tl-event-header">
        <span class="tl-year-badge"
              style="background:${periodColor};color:${getContrastColor(periodColor)};"
        >${evt.year}</span>
        <div class="tl-event-body">
          <span class="tl-event-name">${evt.title}<span class="tl-expand-icon">▼</span></span>
          <span class="tl-province-tag">${evt.region}</span>
        </div>
        <button class="tl-speak-btn" title="Thuyết minh">🔊</button>
      </div>
      <div class="tl-event-expanded tl-hidden">
        ${evt.text ? `<p class="tl-detail-short">${evt.text}</p>` : ''}
        ${detailText && detailText !== evt.text ? `<p class="tl-detail-long">${detailText}</p>` : ''}
      </div>
    `;

    // Toggle expand + navigate to province on map
    const header = item.querySelector('.tl-event-header');
    const expanded = item.querySelector('.tl-event-expanded');
    const expandIcon = item.querySelector('.tl-expand-icon');
    header.addEventListener('click', () => {
      const wasHidden = expanded.classList.contains('tl-hidden');
      // Stop any playing speech
      window.speechSynthesis.cancel();
      document.querySelectorAll('.tl-speak-btn.speaking, .ep-speak-btn.speaking')
        .forEach(b => b.classList.remove('speaking'));
      // Accordion: close all other expanded events + clear map
      if (wasHidden) {
        map.closePopup();
        clearHighlight();
        container.querySelectorAll('.tl-event-expanded:not(.tl-hidden)').forEach(el => {
          el.classList.add('tl-hidden');
          const icon = el.closest('.tl-event-item')?.querySelector('.tl-expand-icon');
          if (icon) icon.style.transform = '';
        });
      }
      expanded.classList.toggle('tl-hidden');
      expandIcon.style.transform = wasHidden ? 'rotate(180deg)' : '';
      if (wasHidden && evt.provinceName) {
        const layerKey = Object.keys(provinceLayers).find(k =>
          k === evt.provinceName || normalizeText(k) === normalizeText(evt.provinceName));
        const layer = layerKey ? provinceLayers[layerKey] : null;
        if (layer) {
          map.closePopup();
          clearHighlight();
          layer.setStyle(highlightedProvinceStyle);
          activeLayer = layerKey;
          map.flyToBounds(layer.getBounds(), { maxZoom: 8, padding: [30, 30] });
        }
      } else if (!wasHidden) {
        map.closePopup();
        clearHighlight();
      }
    });

    // Speak button
    const speakBtn = item.querySelector('.tl-speak-btn');
    if (speakBtn) {
      speakBtn.addEventListener('click', e => {
        e.stopPropagation();
        speakEventDetail(detailText || evt.title, speakBtn);
      });
    }

    // Image click → full-size modal
    const thumb = item.querySelector('.tl-detail-thumb img');
    if (thumb) {
      thumb.addEventListener('error', () => {
        const w = thumb.closest('.tl-detail-thumb');
        if (w) w.style.display = 'none';
      });
      thumb.addEventListener('click', e => {
        e.stopPropagation();
        if (thumb.complete && thumb.naturalWidth > 0) openImageModal(thumb.src, evt.title);
      });
    }

    container.appendChild(item);
  });

}

document.querySelectorAll('.tl-period-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    window.speechSynthesis.cancel();
    document.querySelectorAll('.tl-speak-btn.speaking, .ep-speak-btn.speaking')
      .forEach(b => b.classList.remove('speaking'));
    map.closePopup();
    clearHighlight();
    map.flyToBounds(vietnamBounds, { duration: 0.8, padding: [20, 20] });
    const periodKey = btn.dataset.era;
    activeTimelinePeriod = periodKey;
    applyTimelineFilter(periodKey);
    renderEraEvents(periodKey);
  });
});

/* ═══════════════════════════════════════════════════════
   PANEL 3 – JOURNEY (tự động phát hành trình lịch sử)
═══════════════════════════════════════════════════════ */
function buildJourneyEvents(periodKey) {
  const events = [];
  (vietnamDynasties.events || []).forEach(evt => {
    if (getPeriodKeyFromYear(evt.year) === periodKey)
      events.push({ ...evt, region: 'Toàn quốc', provinceName: null });
  });
  if (regionDataStore) {
    Object.entries(regionDataStore).forEach(([regionKey, data]) => {
      const provinces = data.provinces || [];
      (data.events || []).forEach(evt => {
        if (getPeriodKeyFromYear(evt.year) === periodKey) {
          events.push({ ...evt, region: regionKey.replace(/^Vùng\s+/i, ''), provinceName: provinces[0] || null });
        }
      });
    });
  }
  events.sort((a, b) => (parseYearValue(a.year) || 0) - (parseYearValue(b.year) || 0));

  // Deduplicate national events that appear in many provinces
  const tCount = {};
  events.forEach(e => { const k = normalizeText(e.title); tCount[k] = (tCount[k] || 0) + 1; });
  const seen = new Set();
  return events.filter(e => {
    const k = normalizeText(e.title);
    if (tCount[k] > 2) {
      if (seen.has(k)) return false;
      seen.add(k);
      e.region = 'Toàn quốc';
      e.provinceName = null;
    }
    return true;
  });
}

function selectJourneyPeriod(index) {
  pauseJourney();
  jnGiaiDoan = index;
  jnEventIndex = -1;
  const period = historyPeriods[index];
  jnEvents = buildJourneyEvents(period.key);

  document.querySelectorAll('.jn-period-btn').forEach((btn, i) => {
    const active = i === index;
    btn.classList.toggle('jn-period-active', active);
    btn.style.background = active ? period.color : '';
    btn.style.color = active ? getContrastColor(period.color) : '';
    btn.style.borderColor = active ? 'transparent' : '';
  });

  const nameEl = document.getElementById('jn-period-name');
  const yearsEl = document.getElementById('jn-period-years');
  const counterEl = document.getElementById('jn-event-counter');
  if (nameEl) { nameEl.textContent = period.label; nameEl.style.color = period.color; }
  if (yearsEl) yearsEl.textContent = period.years;
  if (counterEl) counterEl.textContent = `${jnEvents.length} sự kiện`;

  updateJourneyProgress();
  renderJourneyEventList();

  const outsideNorm = (historicalTerritory[period.key] || []).map(n => normalizeText(n));
  Object.entries(provinceLayers).forEach(([pName, layer]) => {
    if (outsideNorm.includes(normalizeText(pName)))
      layer.setStyle({ color: '#c0bdb8', weight: 0.5, fillColor: '#d8d4ce', fillOpacity: 0.12 });
    else
      layer.setStyle({ color: period.color, weight: 0.8, fillColor: period.color, fillOpacity: 0.15 });
  });
  map.fitBounds(vietnamBounds, { animate: true });

  const endEl = document.getElementById('jn-end-overlay');
  if (endEl) endEl.classList.add('jn-hidden');

  const yearEl = document.getElementById('jn-year-display');
  if (yearEl) { yearEl.textContent = period.years; yearEl.style.color = period.color; yearEl.style.display = 'block'; }
}

function renderJourneyEventList() {
  const list = document.getElementById('jn-event-list');
  if (!list) return;
  list.innerHTML = '';
  const color = historyPeriods[jnGiaiDoan]?.color || '#8b1a1a';
  jnEvents.forEach((evt, i) => {
    const item = document.createElement('div');
    item.className = 'jn-ev-item';
    item.dataset.index = i;
    item.innerHTML = `
      <span class="jn-ev-badge" style="background:${color};color:${getContrastColor(color)}">${evt.year}</span>
      <div class="jn-ev-body">
        <span class="jn-ev-title">${evt.title}</span>
        <span class="jn-ev-region">${evt.region}</span>
      </div>
    `;
    item.addEventListener('click', () => { pauseJourney(); playJourneyStep(i); });
    list.appendChild(item);
  });
}

function updateJourneyProgress() {
  const fill = document.getElementById('jn-progress-fill');
  if (fill) fill.style.width = jnEvents.length ? `${Math.round((Math.max(jnEventIndex, 0) / jnEvents.length) * 100)}%` : '0%';
  const counterEl = document.getElementById('jn-event-counter');
  if (counterEl && jnEventIndex >= 0) counterEl.textContent = `${jnEventIndex + 1} / ${jnEvents.length} sự kiện`;
}

function playJourneyStep(index) {
  if (index < 0 || index >= jnEvents.length) return;
  jnEventIndex = index;
  const evt = jnEvents[index];
  const period = historyPeriods[jnGiaiDoan];
  const color = period?.color || '#8b1a1a';

  document.querySelectorAll('.jn-ev-item').forEach((item, i) => {
    item.classList.toggle('jn-ev-active', i === index);
    item.classList.toggle('jn-ev-done', i < index);
  });
  document.querySelector('.jn-ev-item.jn-ev-active')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  updateJourneyProgress();

  const yearEl = document.getElementById('jn-year-display');
  if (yearEl) {
    yearEl.textContent = evt.year;
    yearEl.style.color = color;
    yearEl.classList.add('jn-year-pulse');
    setTimeout(() => yearEl.classList.remove('jn-year-pulse'), 400);
  }

  const outsideNorm = (historicalTerritory[period.key] || []).map(n => normalizeText(n));
  const evtNorm = evt.provinceName ? normalizeText(evt.provinceName) : null;
  Object.entries(provinceLayers).forEach(([pName, layer]) => {
    if (outsideNorm.includes(normalizeText(pName))) {
      layer.setStyle({ color: '#c0bdb8', weight: 0.5, fillColor: '#d8d4ce', fillOpacity: 0.12 });
    } else if (evtNorm && normalizeText(pName) === evtNorm) {
      layer.setStyle({ color: color, weight: 2.5, fillColor: color, fillOpacity: 0.82 });
      const el = layer.getElement ? layer.getElement() : null;
      if (el) { el.classList.add('tinh-pulse'); setTimeout(() => el.classList.remove('tinh-pulse'), 900); }
      map.panTo(layer.getBounds().getCenter(), { animate: true });
    } else {
      layer.setStyle({ color: color, weight: 0.8, fillColor: color, fillOpacity: 0.15 });
    }
  });

  if (jnMarker) { map.removeLayer(jnMarker); jnMarker = null; }

  let latlng;
  if (evt.provinceName && provinceLayers[evt.provinceName]) {
    latlng = provinceLayers[evt.provinceName].getBounds().getCenter();
  } else {
    latlng = L.latLng(16.5, 107.5);
  }
  jnMarker = L.marker(latlng, {
    icon: L.divIcon({
      className: '',
      html: `<div class="jn-marker-card jn-marker-in">
        <span class="jn-marker-year" style="background:${color};color:${getContrastColor(color)}">${evt.year}</span>
        <div class="jn-marker-title">${evt.title}</div>
        ${evt.region !== 'Toàn quốc' ? `<div class="jn-marker-region">📍 ${evt.region}</div>` : ''}
      </div>`,
      iconSize: [210, null],
      iconAnchor: [-8, 60]
    }),
    interactive: false,
    zIndexOffset: 1000
  }).addTo(map);

  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const txt = prepareSpokenText(`Năm ${evt.year}${evt.region !== 'Toàn quốc' ? ', tại ' + evt.region : ''}, ${evt.title}${evt.text ? '. ' + evt.text : ''}`);
    const utt = new SpeechSynthesisUtterance(txt);
    utt.lang = 'vi-VN'; utt.rate = 0.92;
    window.speechSynthesis.speak(utt);
    return utt;
  }
  return null;
}

function playJourney() {
  if (jnPlaying) return;
  jnPlaying = true;
  const playBtn = document.getElementById('jn-play');
  if (playBtn) { playBtn.textContent = '⏸ Dừng'; playBtn.classList.add('jn-playing'); }

  function tick() {
    const next = jnEventIndex + 1;
    if (next >= jnEvents.length) {
      pauseJourney();
      showJourneyEnd();
      return;
    }
    const utt = playJourneyStep(next);
    const advance = () => {
      if (!jnPlaying) return;
      if (jnMarker) { map.removeLayer(jnMarker); jnMarker = null; }
      jnTimeout = setTimeout(() => { if (jnPlaying) tick(); }, 600);
    };
    if (utt) {
      utt.onend = advance;
      utt.onerror = advance;
    } else {
      jnTimeout = setTimeout(advance, jnSpeed);
    }
  }
  tick();
}

function pauseJourney() {
  jnPlaying = false;
  if (jnTimeout) { clearTimeout(jnTimeout); jnTimeout = null; }
  if (window.speechSynthesis) window.speechSynthesis.cancel();
  if (jnMarker) { map.removeLayer(jnMarker); jnMarker = null; }
  map.closePopup();
  const playBtn = document.getElementById('jn-play');
  if (playBtn) { playBtn.textContent = '▶ Phát'; playBtn.classList.remove('jn-playing'); }
}

function stepJourney(delta) {
  pauseJourney();
  const next = jnEventIndex + delta;
  if (next >= 0 && next < jnEvents.length) playJourneyStep(next);
}

function showJourneyEnd() {
  const endEl = document.getElementById('jn-end-overlay');
  if (!endEl) return;
  const period = historyPeriods[jnGiaiDoan];
  const nextPeriod = historyPeriods[jnGiaiDoan + 1];
  endEl.classList.remove('jn-hidden');
  if (nextPeriod) {
    endEl.innerHTML = `
      <p class="jn-end-text">✅ Giai đoạn <strong>${period.label}</strong> kết thúc!</p>
      <button class="jn-end-btn">▶ Xem tiếp: ${nextPeriod.label}</button>
    `;
    endEl.querySelector('.jn-end-btn').addEventListener('click', () => {
      endEl.classList.add('jn-hidden');
      selectJourneyPeriod(jnGiaiDoan + 1);
    });
  } else {
    endEl.innerHTML = `
      <p class="jn-end-text">🎉 Bạn đã hoàn thành hành trình nghìn năm lịch sử Việt Nam!</p>
      <button class="jn-end-btn">🎯 Vào Quiz kiểm tra kiến thức</button>
    `;
    endEl.querySelector('.jn-end-btn').addEventListener('click', () => {
      endEl.classList.add('jn-hidden');
      switchMode('quiz');
    });
  }
}

function initJourneyPanel() {
  const grid = document.getElementById('jn-period-grid');
  if (grid) {
    historyPeriods.forEach((p, i) => {
      const btn = document.createElement('button');
      btn.className = 'jn-period-btn';
      btn.innerHTML = `<span class="jn-pnum">${p.number}</span>${p.label}`;
      btn.addEventListener('click', () => selectJourneyPeriod(i));
      grid.appendChild(btn);
    });
  }
  document.getElementById('jn-play')?.addEventListener('click', () => jnPlaying ? pauseJourney() : playJourney());
  document.getElementById('jn-prev')?.addEventListener('click', () => stepJourney(-1));
  document.getElementById('jn-next')?.addEventListener('click', () => stepJourney(1));
  document.getElementById('jn-first')?.addEventListener('click', () => { pauseJourney(); if (jnEvents.length) playJourneyStep(0); });
  document.getElementById('jn-last')?.addEventListener('click', () => { pauseJourney(); if (jnEvents.length) playJourneyStep(jnEvents.length - 1); });
  document.querySelectorAll('.jn-speed-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      jnSpeed = Number(btn.dataset.speed);
      document.querySelectorAll('.jn-speed-btn').forEach(b => b.classList.remove('jn-speed-active'));
      btn.classList.add('jn-speed-active');
    });
  });
}

initJourneyPanel();

/* ═══════════════════════════════════════════════════════
   PANEL 4 – QUIZ
═══════════════════════════════════════════════════════ */
/* ── Quiz: sinh câu hỏi động từ regionDataStore ── */
function generateQuizQuestions() {
  const shuffle = arr => { const a=[...arr]; for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a; };
  const pool = [];
  const allLocNames = new Set();
  if (regionDataStore) {
    Object.entries(regionDataStore).forEach(([rk, data]) => {
      const pName = (data.provinces||[])[0]||null;
      const region = rk.replace(/^Vùng\s+/i,'');
      if (region) { allLocNames.add(region); region.split(/[\s\-–]+/).forEach(w => { if (w.length >= 3) allLocNames.add(w); }); }
      if (pName) { allLocNames.add(pName); pName.split(/[\s\-–]+/).forEach(w => { if (w.length >= 3) allLocNames.add(w); }); }
      (data.provinces||[]).forEach(p => { allLocNames.add(p); p.split(/[\s\-–]+/).forEach(w => { if (w.length >= 3) allLocNames.add(w); }); });
      (data.events||[]).forEach(evt => pool.push({ title:evt.title, text:evt.text||'', year:evt.year, region, provinceName:pName }));
    });
  }
  (vietnamDynasties.events||[]).forEach(evt => pool.push({ title:evt.title, text:evt.text||'', year:evt.year, region:'Toàn quốc', provinceName:null }));
  if (pool.length < 4) return [];

  const locPattern = new RegExp(
    [...allLocNames].filter(n => n.length > 1).map(n => n.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')).sort((a,b) => b.length - a.length).join('|'),
    'gi'
  );
  const maskLoc = (text) => text.replace(locPattern, '___');

  const withProvince = pool.filter(e => e.provinceName);
  const allTitles = pool.map(e => e.title);
  const allYears  = pool.map(e => e.year);
  const plan = ['map','year','event','year','map','event','year','map','event','year'];
  const used = new Set();
  const questions = [];

  for (const type of plan) {
    if (questions.length >= 10) break;
    const evtPool = shuffle(type === 'map' ? withProvince : pool);
    const evt = evtPool.find(e => !used.has(e.title));
    if (!evt) continue;
    used.add(evt.title);

    if (type === 'map') {
      const mapTitle = (() => {
        let t = evt.title;
        [evt.region, evt.provinceName].filter(Boolean).forEach(name => {
          t = t.replace(new RegExp(name.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'gi'), 'tỉnh/thành phố nào');
        });
        return maskLoc(t);
      })();
      questions.push({ type:'map', question:`Năm <b>${evt.year}</b>, ${mapTitle}? Hãy click vào bản đồ!`, answer:evt.provinceName, regionLabel:evt.region });
    } else if (type === 'year') {
      const wrongs = shuffle([...new Set(allYears.filter(y => y !== evt.year))]).slice(0,3);
      const opts = shuffle([evt.year,...wrongs]);
      questions.push({ type:'year', question:`Năm bao nhiêu <b>${evt.title}</b>?`, options:opts, correctIndex:opts.indexOf(evt.year) });
    } else {
      const wrongs = shuffle([...new Set(allTitles.filter(t => t !== evt.title))]).slice(0,3);
      const opts = shuffle([evt.title,...wrongs]);
      questions.push({ type:'event', question:`Năm <b>${evt.year}</b>, sự kiện nào xảy ra?`, options:opts, correctIndex:opts.indexOf(evt.title) });
    }
  }
  return shuffle(questions);
}

function updateQuizHeader(q) {
  const labels = { map:'Click bản đồ', year:'Chọn năm', event:'Chọn sự kiện' };
  const counter = document.getElementById('qz-counter');
  const badge   = document.getElementById('qz-type-badge');
  const scoreEl = document.getElementById('qz-score');
  const fill    = document.getElementById('quiz-progress-fill');
  if (counter) counter.textContent = `Câu ${qzIndex+1} / ${qzQuestions.length}`;
  if (badge && q) { badge.textContent = labels[q.type]||''; badge.className = `qz-type-badge qz-type-${q.type}`; }
  if (scoreEl) scoreEl.textContent = `${qzScore} điểm`;
  if (fill) fill.style.width = `${(qzIndex/(qzQuestions.length||10))*100}%`;
}

function renderQuiz() {
  const content = document.getElementById('quiz-content');
  if (!content) return;
  if (!qzQuestions.length) { initQuiz(); return; }
  if (qzIndex >= qzQuestions.length) { showQuizResult(); return; }

  const q = qzQuestions[qzIndex];
  qzAnswered = false;
  updateQuizHeader(q);

  let bodyHTML;
  if (q.type === 'map') {
    bodyHTML = `<div class="qz-map-hint" id="qz-map-hint">
      <input type="checkbox" disabled checked style="margin-right:6px;vertical-align:middle">
      Nhấn trực tiếp vào vùng tỉnh thành trên bản đồ bên trái để trả lời
    </div>`;
  } else {
    const letters = ['A','B','C','D'];
    bodyHTML = `<div class="qz-options">${q.options.map((opt,i)=>`
      <button class="qz-opt-btn" data-idx="${i}">
        <span class="qz-opt-letter">${letters[i]}</span>
        <span class="qz-opt-text">${opt}</span>
      </button>`).join('')}</div>`;
  }

  content.innerHTML = `
    <div class="qz-card">
      <p class="qz-question">${q.question}</p>
      ${bodyHTML}
      <div class="qz-feedback qz-fb-hidden" id="qz-feedback"></div>
    </div>`;

  Object.values(provinceLayers).forEach(l => l.setStyle(defaultProvinceStyle));
  map.fitBounds(vietnamBounds);

  if (q.type !== 'map') {
    content.querySelectorAll('.qz-opt-btn').forEach(btn => {
      btn.addEventListener('click', () => handleQuizChoice(parseInt(btn.dataset.idx)));
    });
  }
}

function handleQuizChoice(idx) {
  if (qzAnswered) return;
  qzAnswered = true;
  const q = qzQuestions[qzIndex];
  const isCorrect = idx === q.correctIndex;
  if (isCorrect) qzScore += 10;

  document.querySelectorAll('.qz-opt-btn').forEach((btn, i) => {
    btn.disabled = true;
    if (i === q.correctIndex) btn.classList.add('qz-opt-correct');
    else if (i === idx && !isCorrect) btn.classList.add('qz-opt-wrong');
  });

  updateQuizHeader(q);
  quizShowFeedback(isCorrect);
  scheduleNextQuestion();
}

function handleQuizMapClick(provinceName) {
  if (qzAnswered) return;
  const q = qzQuestions[qzIndex];
  if (!q || q.type !== 'map') return;
  qzAnswered = true;

  const isCorrect = normalizeText(provinceName).includes(normalizeText(q.answer))
    || normalizeText(q.answer).includes(normalizeText(provinceName));

  if (isCorrect) {
    qzScore += 10;
    provinceLayers[provinceName]?.setStyle({ color:'#1a6b3a', weight:3, fillColor:'#4caf50', fillOpacity:0.72 });
  } else {
    provinceLayers[provinceName]?.setStyle({ color:'#8b1212', weight:3, fillColor:'#ff6b6b', fillOpacity:0.6 });
    const correctKey = Object.keys(provinceLayers).find(n =>
      normalizeText(n).includes(normalizeText(q.answer)) || normalizeText(q.answer).includes(normalizeText(n)));
    if (correctKey) setTimeout(() => provinceLayers[correctKey]?.setStyle({ color:'#1a6b3a', weight:3, fillColor:'#4caf50', fillOpacity:0.72 }), 500);
  }

  const hint = document.getElementById('qz-map-hint');
  if (hint) hint.innerHTML = isCorrect ? '✅ Chính xác!' : `❌ Chưa đúng — Đáp án: <b>${q.regionLabel}</b>`;

  updateQuizHeader(q);
  quizShowFeedback(isCorrect);
  scheduleNextQuestion();
}

function quizShowFeedback(isCorrect) {
  const fb = document.getElementById('qz-feedback');
  if (!fb) return;
  fb.textContent = isCorrect ? '✅ Chính xác! +10 điểm' : '❌ Chưa đúng';
  fb.className = `qz-feedback ${isCorrect ? 'qz-fb-correct' : 'qz-fb-wrong'}`;
}

function scheduleNextQuestion() {
  if (qzAutoTimer) clearTimeout(qzAutoTimer);
  qzAutoTimer = setTimeout(() => { qzIndex++; renderQuiz(); }, 2000);
}

function showQuizResult() {
  const content = document.getElementById('quiz-content');
  if (!content) return;
  const total = qzQuestions.length;
  const maxScore = total * 10;
  const pct = qzScore / maxScore * 100;
  const [icon, rank] = pct >= 90 ? ['🏆','Nhà sử học tương lai!'] : pct >= 70 ? ['⭐','Hiểu biết lịch sử rất tốt!'] : pct >= 50 ? ['👍','Cần ôn thêm một số giai đoạn.'] : ['📚','Hãy xem lại Hành trình lịch sử nhé!'];
  const correct = qzScore / 10;

  document.getElementById('quiz-progress-fill').style.width = '100%';
  document.getElementById('qz-score').textContent = `${qzScore} điểm`;
  document.getElementById('qz-counter').textContent = `Kết quả`;
  const badge = document.getElementById('qz-type-badge');
  if (badge) { badge.textContent = ''; }

  content.innerHTML = `
    <div class="qz-result">
      <div class="qz-result-icon">${icon}</div>
      <div class="qz-result-score">${qzScore}<span class="qz-result-max"> / ${maxScore}</span></div>
      <p class="qz-result-rank">${rank}</p>
      <div class="qz-result-stats">
        <div class="qz-stat qz-stat-ok">✅ Đúng <strong>${correct}</strong></div>
        <div class="qz-stat qz-stat-no">❌ Sai <strong>${total - correct}</strong></div>
      </div>
      <div class="qz-result-actions">
        <button class="qz-result-btn" id="qz-replay">↺ Chơi lại</button>
        <button class="qz-result-btn qz-result-btn-sec" id="qz-to-journey">🧭 Hành trình</button>
      </div>
    </div>`;

  Object.values(provinceLayers).forEach(l => l.setStyle(defaultProvinceStyle));
  activeLayer = null; map.fitBounds(vietnamBounds);
  document.getElementById('qz-replay')?.addEventListener('click', initQuiz);
  document.getElementById('qz-to-journey')?.addEventListener('click', () => switchMode('journey'));
}

function initQuiz() {
  if (qzAutoTimer) clearTimeout(qzAutoTimer);
  qzQuestions = generateQuizQuestions();
  qzIndex = 0; qzScore = 0; qzAnswered = false;
  renderQuiz();
}

document.getElementById('quiz-restart').addEventListener('click', initQuiz);

/* ═══════════════════════════════════════════════════════
   EXPLORE PANEL – helpers
═══════════════════════════════════════════════════════ */

function showSearchError(msg) {
  const el = document.getElementById('search-error');
  if (el) el.textContent = msg;
}

function clearSearchError() {
  const el = document.getElementById('search-error');
  if (el) el.textContent = '';
}

function initExploreDefault() {
  Object.values(provinceLayers).forEach(l => l.setStyle(exploreDefaultStyle));
  activeLayer = null;

  const hanoiKey = Object.keys(regionDataStore || {}).find(k =>
    normalizeText(k) === 'ha noi' || normalizeText(k).includes('ha noi')
  ) || 'Hà Nội';
  const hanoiData = regionDataStore && regionDataStore[hanoiKey];

  if (hanoiData) renderExplorePanel(hanoiData);

  // Use the actual provinceLayers key so clearHighlight() can find it later
  const hanoiEntry = Object.entries(provinceLayers).find(([n]) =>
    n === 'Hà Nội' || normalizeText(n) === 'ha noi' || normalizeText(n).includes('ha noi')
  );
  if (hanoiEntry) {
    const [hanoiName, hanoiLayer] = hanoiEntry;
    hanoiLayer.setStyle(exploreClickStyle);
    activeLayer = hanoiName;
    map.flyToBounds(hanoiLayer.getBounds(), { maxZoom: 9, padding: [30, 30] });
  }
}

function renderExplorePanel(data, mergeInfo = null, clickedName = null) {
  const container = document.getElementById('explore-result');
  if (!container) return;
  container.innerHTML = '';

  const header = document.createElement('div');
  header.className = 'ep-header';
  const rawTitle = (data.title || '').replace(/^Vùng\s+/i, '');
  header.innerHTML = `
    <h2 class="ep-province-title">${rawTitle}</h2>
    ${data.description ? `<p class="ep-province-desc">${data.description}</p>` : ''}
    ${buildMergeBanner(mergeInfo, clickedName)}
  `;
  container.appendChild(header);

  const events = Array.isArray(data.events) ? data.events : [];
  if (!events.length) {
    const empty = document.createElement('p');
    empty.style.cssText = 'color:#6b4040;font-weight:700;padding:16px 0;';
    empty.textContent = 'Chưa có sự kiện nổi bật cho vùng này.';
    container.appendChild(empty);
    return;
  }

  const list = document.createElement('div');
  list.className = 'ep-events';

  events.forEach(evt => {
    const card = document.createElement('div');
    card.className = 'ep-event';

    const imgSrc = getEventIllustrationSrc(evt.title);
    const detailText = (evt.detail && evt.detail !== evt.text) ? evt.detail : (evt.text || '');

    card.innerHTML = `
      <div class="ep-event-top">
        <span class="ep-badge">${evt.year}</span>
        <div class="ep-event-body">
          <h3 class="ep-event-title">
            ${evt.title}
            <span class="ep-expand-icon">▼</span>
          </h3>
          ${evt.text ? `<p class="ep-event-short">${evt.text}</p>` : ''}
          <div class="ep-event-detail ep-hidden">${detailText}</div>
        </div>
        <button class="ep-speak-btn" title="Thuyết minh">🔊</button>
      </div>
      ${imgSrc ? `<div class="ep-thumbnail ep-hidden">
        <img src="${imgSrc}" alt="Tư liệu: ${evt.title}" loading="lazy"
             onerror="this.closest('.ep-thumbnail').style.display='none'" />
      </div>` : ''}
    `;

    const titleEl = card.querySelector('.ep-event-title');
    const detailEl = card.querySelector('.ep-event-detail');
    const thumbEl = card.querySelector('.ep-thumbnail');
    if (titleEl && detailEl) {
      titleEl.addEventListener('click', () => {
        window.speechSynthesis.cancel();
        document.querySelectorAll('.tl-speak-btn.speaking, .ep-speak-btn.speaking')
          .forEach(b => b.classList.remove('speaking'));
        const isExpanded = titleEl.classList.toggle('ep-expanded');
        detailEl.classList.toggle('ep-hidden', !isExpanded);
        if (thumbEl) thumbEl.classList.toggle('ep-hidden', !isExpanded);
      });
    }

    const speakBtn = card.querySelector('.ep-speak-btn');
    speakBtn.addEventListener('click', () => {
      speakEventDetail(detailText || evt.title, speakBtn);
    });

    const thumb = card.querySelector('.ep-thumbnail img');
    if (thumb) {
      thumb.addEventListener('error', () => {
        const wrapper = thumb.closest('.ep-thumbnail');
        if (wrapper) wrapper.style.display = 'none';
      });
      thumb.addEventListener('click', () => {
        if (thumb.complete && thumb.naturalWidth > 0) {
          openImageModal(thumb.src, evt.title);
        }
      });
    }

    list.appendChild(card);
  });

  container.appendChild(list);
}

function renderExploreFallback(name, info, mergeInfo = null, clickedName = null) {
  const container = document.getElementById('explore-result');
  if (!container) return;
  container.innerHTML = `
    <div class="ep-header">
      <h2 class="ep-province-title">${name}</h2>
      ${info.description ? `<p class="ep-province-desc">${info.description}</p>` : ''}
      ${buildMergeBanner(mergeInfo, clickedName || name)}
    </div>
    <div style="padding:8px 0;display:flex;flex-direction:column;gap:8px;">
      ${info.population ? `<div style="font-size:.9rem;font-weight:700;color:#3c0f0d;">👥 Dân số: ${info.population}</div>` : ''}
      ${info.area ? `<div style="font-size:.9rem;font-weight:700;color:#3c0f0d;">📐 Diện tích: ${info.area}</div>` : ''}
    </div>
  `;
}
