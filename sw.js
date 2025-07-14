// Cấu hình Firebase (giữ nguyên)
const firebaseConfig = {
  apiKey: "AIzaSyDdr-P9TR-PGOGfpUyvNu0h5pkblE9x5IM",
  authDomain: "nhat-ky-lam-cot.firebaseapp.com",
  projectId: "nhat-ky-lam-cot",
  storageBucket: "nhat-ky-lam-cot.appspot.com",
  messagingSenderId: "617668835076",
  appId: "1:617668835076:web:c56006270e42a0955d8251"
};

// Khởi tạo Firebase
firebase.initializeApp(firebaseConfig);
const storage = firebase.storage();
const db = firebase.firestore();
const auth = firebase.auth();

// ✅ Danh sách user được phép
const ALLOWED_USERS = {
  "kiencr1403@gmail.com": {
    id: "bii",
    name: "bii",
    locketTarget: "quin" // Gửi locket cho quìn
  },
  "tranquynh13082008@gmail.com": {
    id: "quin",
    name: "quìn",
    locketTarget: "bii" // Gửi locket cho bii
  }
};

// ✅ Hàm đăng nhập + nhận diện
function loginWithGoogle() {
  const provider = new firebase.auth.GoogleAuthProvider();
  
  auth.signInWithPopup(provider)
    .then((result) => {
      const user = result.user;
      const userData = ALLOWED_USERS[user.email];
      
      if (!userData) {
        auth.signOut();
        throw new Error("❤️ App chỉ dành riêng cho bii và quìn thôi!");
      }

      // Lưu thông tin user vào localStorage
      localStorage.setItem("currentUser", JSON.stringify({
        id: userData.id,
        name: userData.name,
        email: user.email,
        target: userData.locketTarget // ID người nhận locket
      }));

      // Hiển thị thông báo thành công
      alert(`Chào ${userData.name}! Bạn đang gửi locket cho ${userData.locketTarget} ❤️`);
      location.reload(); // Tải lại trang để áp dụng thay đổi
    })
    .catch((error) => {
      alert(error.message);
      console.error("Lỗi đăng nhập:", error);
    });
}

// ✅ Tự động kiểm tra đăng nhập khi trang load
function checkAuth() {
  const user = JSON.parse(localStorage.getItem("currentUser"));
  
  if (user) {
    console.log(`User hiện tại: ${user.name} (${user.email})`);
    console.log(`Sẽ gửi locket cho: ${user.target}`);
  } else {
    loginWithGoogle(); // Chưa đăng nhập -> hiện popup
  }
}

// Gọi hàm check khi trang load
window.addEventListener("load", checkAuth);

// Xuất các biến cần thiết
export { auth, db, storage, loginWithGoogle };
