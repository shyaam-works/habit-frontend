import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash, FaLock } from "react-icons/fa";
import "../styles/LoadingKeys.css"; // spinner css
import "react-toastify/dist/ReactToastify.css";

const Navbar = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  // change password
  const [showChangePw, setShowChangePw] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // logout
  const [logoutLoading, setLogoutLoading] = useState(false);

  // visibility toggles
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);

  const handleLogout = async () => {
    setLogoutLoading(true);
    try {
      await api.post("/api/auth/logout");

      toast.success("Logged out successfully");

      // IMPORTANT: allow toast paint, then navigate
      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 100);
    } catch (err) {
      toast.error("Logout failed");
      setLogoutLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      toast.error("All fields are required");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      await api.post("/api/auth/changepw", {
        currentPassword,
        newPassword,
      });

      toast.success("Password changed successfully");
      setShowChangePw(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Password change failed");
    } finally {
      setLoading(false);
    }
  };

  // close menu on outside click
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <>
      {/* LOGOUT LOADER (NON-BLOCKING) */}
      {logoutLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/70">
          <div className="loadingspinner">
            <div id="square1"></div>
            <div id="square2"></div>
            <div id="square3"></div>
            <div id="square4"></div>
            <div id="square5"></div>
          </div>
        </div>
      )}

      <nav className="fixed top-0 left-0 right-0 z-40 bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1
            onClick={() => navigate("/habits")}
            className="text-2xl font-extrabold cursor-pointer"
          >
            HabitTracker
          </h1>

          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setOpen((p) => !p)}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <span className="text-2xl font-bold">⋮</span>
            </button>

            {open && (
              <div className="absolute right-0 mt-3 w-52 bg-white border rounded-xl shadow-lg overflow-hidden">
                <NavItem
                  label="All Habits"
                  onClick={() => navigate("/habits")}
                />
                <NavItem label="Add Habit" onClick={() => navigate("/add")} />
                <NavItem
                  label="All Habits Heat"
                  onClick={() => navigate("/all-habits-heat")}
                />
                <NavItem
                  label="Analytics"
                  onClick={() => navigate("/analytics")}
                />
                <NavItem
                  label="Change Password"
                  onClick={() => setShowChangePw(true)}
                />
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* CHANGE PASSWORD MODAL */}
      {showChangePw && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
            <h2 className="text-xl font-semibold mb-6 text-center">
              Change Password
            </h2>

            <PasswordField
              value={currentPassword}
              setValue={setCurrentPassword}
              show={showCurrentPw}
              setShow={setShowCurrentPw}
              placeholder="Current password"
            />

            <PasswordField
              value={newPassword}
              setValue={setNewPassword}
              show={showNewPw}
              setShow={setShowNewPw}
              placeholder="New password"
            />

            <PasswordField
              value={confirmNewPassword}
              setValue={setConfirmNewPassword}
              show={showConfirmPw}
              setShow={setShowConfirmPw}
              placeholder="Confirm password"
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowChangePw(false)}
                className="px-4 py-2 border rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleChangePassword}
                disabled={loading}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg"
              >
                {loading ? "Updating..." : "Update"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

/* helpers */
const NavItem = ({ label, onClick }) => (
  <button
    onClick={() => {
      onClick();
    }}
    className="w-full text-left px-4 py-3 hover:bg-gray-100"
  >
    {label}
  </button>
);

const PasswordField = ({ value, setValue, show, setShow, placeholder }) => (
  <div className="flex items-center border rounded-xl px-3 py-2 mb-4">
    <FaLock className="text-gray-400 mr-2" />
    <input
      type={show ? "text" : "password"}
      placeholder={placeholder}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      className="w-full outline-none"
    />
    <button onClick={() => setShow((p) => !p)}>
      {show ? <FaEye /> : <FaEyeSlash />}
    </button>
  </div>
);

export default Navbar;
