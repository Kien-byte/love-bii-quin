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
// 🔄 Theo dõi trạng thái đăng nhập tự động
auth.onAuthStateChanged((user) => {
  if (user && ALLOWED_USERS[user.email]) {
    const userData = ALLOWED_USERS[user.email];
    localStorage.setItem("currentUser", JSON.stringify({
      id: userData.id,
      name: userData.name,
      email: user.email,
      target: userData.locketTarget
    }));
    console.log("Đã đăng nhập:", user.email);
    
    // Hiển thị thông báo nếu cần
    if (!localStorage.getItem('loginShown')) {
      alert(`Chào ${userData.name}! ❤️`);
      localStorage.setItem('loginShown', 'true');
    }
  } else {
    console.log("Chưa đăng nhập");
    localStorage.removeItem("currentUser");
    localStorage.removeItem('loginShown');
    
    // Tự động hiện popup đăng nhập nếu không có user
    if (!user) {
      setTimeout(() => {
        if (!localStorage.getItem("currentUser")) {
          loginWithGoogle();
        }
      }, 1000);
    }
  }
});

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


// Gọi hàm check khi trang load
window.addEventListener("load", checkAuth);
// Xuất các biến cần thiết
export { auth, db, storage, loginWithGoogle };

// Thêm vào firebase.js
async function sendLocket(file, caption) {
  try {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (!user) throw new Error("Bạn chưa đăng nhập!");

    // Tạo tên file ngẫu nhiên
    const fileName = `locket_${Date.now()}_${user.id}.jpg`;
    const storageRef = storage.ref(`lockets/${fileName}`);

    // Upload ảnh lên Firebase Storage
    const snapshot = await storageRef.put(file);
    const imageUrl = await snapshot.ref.getDownloadURL();

    // Lưu thông tin vào Firestore
    await db.collection("lockets").add({
      senderId: user.id,
      senderName: user.name,
      targetId: user.target,
      imageUrl: imageUrl,
      caption: caption,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });

    return true;
  } catch (error) {
    console.error("Lỗi khi gửi locket:", error);
    throw error;
  }
}

// Xuất thêm hàm sendLocket
export { auth, db, storage, loginWithGoogle, sendLocket };
// Hiển thị nút đăng nhập nếu chưa đăng nhập
function showTempLoginButton() {
  const btn = document.getElementById('temp-login-btn');
  if (!localStorage.getItem('currentUser')) {
    btn.style.display = 'block';
    btn.onclick = loginWithGoogle;
  }
}

function initAuth() {
  const loginBtn = document.getElementById('temp-login-btn');
  
  // Hiển thị nút ngay lập tức
  if (loginBtn) {
    loginBtn.style.display = 'block';
    loginBtn.onclick = () => {
      loginWithGoogle();
      loginBtn.style.display = 'none'; // Ẩn sau khi click
    };
  }

  // Kiểm tra trạng thái đăng nhập
  auth.onAuthStateChanged((user) => {
    if (user && ALLOWED_USERS[user.email]) {
      console.log("Đã đăng nhập:", user.email);
    } else {
      if (loginBtn) loginBtn.style.display = 'block';
    }
  });
}

// Gọi hàm khi trang load
window.addEventListener('load', initAuth);

  // Tự động ẩn nút khi đã đăng nhập
  auth.onAuthStateChanged((user) => {
    const btn = document.getElementById('temp-login-btn');
    if (btn) btn.style.display = 'none';
    
    if (user && ALLOWED_USERS[user.email]) {
      const userData = ALLOWED_USERS[user.email];
      localStorage.setItem("currentUser", JSON.stringify({
        id: userData.id,
        name: userData.name,
        email: user.email,
        target: userData.locketTarget
      }));
      console.log("Đã đăng nhập:", user.email);
    } else {
      localStorage.removeItem("currentUser");
      showLoginButton(); // Hiện nút nếu chưa đăng nhập
    }
  });

  // Hiển thị nút ngay khi load trang
  window.addEventListener('load', showLoginButton);

