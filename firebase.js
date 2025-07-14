// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDdr-P9TR-PGOGfpUyvNu0h5pkblE9x5IM",
  authDomain: "nhat-ky-lam-cot.firebaseapp.com",
  projectId: "nhat-ky-lam-cot",
 storageBucket: "nhat-ky-lam-cot.appspot.com",
  messagingSenderId: "617668835076",
  appId: "1:617668835076:web:c56006270e42a0955d8251"
};

  firebase.initializeApp(firebaseConfig);
  const storage = firebase.storage();
  const db = firebase.firestore();
    //AUTH
   const auth = firebase.auth();
   // ✅ Hàm đăng nhập bằng Google
function loginWithGoogle() {
  const provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider)
    .then((result) => {
      const user = result.user;
      localStorage.setItem("biiUser", JSON.stringify({
        name: user.displayName,
        email: user.email,
        photo: user.photoURL
      }));
      alert("🎉 Đăng nhập thành công! Xin chào " + user.displayName);
      location.reload(); // hoặc update UI tùy
    })
    .catch((error) => {
      console.error("Lỗi đăng nhập:", error);
    });
}

// ✅ Hàm kiểm tra trạng thái đã đăng nhập chưa
function checkLogin() {
  const user = localStorage.getItem("biiUser");
  if (user) {
    // Nếu có user trong localStorage thì hiện thông tin
    console.log("Đã đăng nhập:", JSON.parse(user));
  } else {
    // Nếu chưa đăng nhập thì gọi login popup
    loginWithGoogle();
  }
}

// ✅ Gọi tự động khi trang load
window.addEventListener("load", () => {
  checkLogin();
});
