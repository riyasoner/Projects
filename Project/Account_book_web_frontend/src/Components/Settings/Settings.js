import React, { useEffect, useState } from "react";
import endPoints from "../../api/endPoints";
import useApi from "../../hooks/useApi";

const Settings = () => {
    const { get, patch } = useApi();
    const [settings, setSettings] = useState({
        timezone: "GMT",
        email_id: "",
        phone_no: "",
        name: "",
    });
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState(""); 

    // Get userId from localStorage
    const userId = localStorage.getItem("userId");

    // Fetch user info
    useEffect(() => {
        if (userId) {
            const fetchSettings = async () => {
                try {
                    const response = await get(`${endPoints.getUserInfo}?id=${userId}`);
                    if (response.data[0]) {
                        setSettings({
                            timezone: response.data[0].timezone || "GMT",
                            email_id: response.data[0].email_id || "",
                            phone_no: response.data[0].phone_no || "",
                            name: response.data[0].name || "",
                        });
                    }
                } catch (error) {
                    console.error("Error fetching settings:", error);
                    setMessage("Failed to fetch user settings!");
                }
            };

            fetchSettings();
        }
    }, [userId, get]);

    // Handle update name
    const handleNameUpdate = async () => {
        setIsLoading(true);
        try {
            const response = await patch(endPoints.updateUserInfoAndPass, {
                id: userId,
                name: settings.name,
            });

            if (response.status) {
                setMessage(response.message||"Name updated successfully!");
                localStorage.setItem("name", settings.name);
            }
        } catch (error) {
            console.error("Error updating name:", error);
            setMessage(error.message||"Failed to update name!");
        } finally {
            setIsLoading(false);
        }
    };

    // Handle update password
    const handlePasswordUpdate = async () => {
        setIsLoading(true);

        const data = {
            id: userId,
            current_password: currentPassword,
            new_password: newPassword,
            confirm_new_password: confirmNewPassword,
        };

        try {
            const response = await patch(endPoints.updateUserInfoAndPass, data);

            if (response.status) {
                setMessage(response.message||"Password updated successfully!");
            }
        } catch (error) {
            console.error("Error updating password:", error);
            setMessage(error.message||"Failed to update password!");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container mt-5">
            {message && (
                <div className="mt-3 alert alert-info">
                    {message}
                </div>
            )}
            <div className="card" style={{ maxWidth: "1000px" }}>

                {/* Card Header */}
                <div className="card-header d-flex align-items-center" style={{ backgroundColor: "#419EB9" }}>
                    <span className="text-white">
                        <i className="bi bi-gear"></i> Settings
                    </span>
                </div>
                {/* Display Message */}



                {/* Card Body */}
                <div className="card-body">
                    {/* Timezone Field */}
                    <div className="mb-3 row">
                        <label htmlFor="timezone" className="col-md-2 col-form-label text-muted">
                            Timezone
                        </label>
                        <div className="col-md-8">
                            <select
                                id="timezone"
                                className="form-select"
                                name="timezone"
                                value={settings.timezone}
                                onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
                            >
                                <option value="GMT">GMT</option>
                                <option value="UTC">UTC</option>
                                <option value="PST">PST</option>
                                <option value="EST">EST</option>
                            </select>
                        </div>
                    </div>
                    <hr />

                    {/* Email Field */}
                    <div className="mb-3 row">
                        <label htmlFor="email" className="col-md-2 col-form-label text-muted">
                            Email
                        </label>
                        <div className="col-md-8">
                            <input
                                type="email"
                                className="form-control"
                                id="email"
                                name="email"
                                value={settings.email_id}
                                disabled
                            />
                        </div>
                    </div>
                    <hr />

                    {/* Phone Field */}
                    <div className="mb-3 row">
                        <label htmlFor="phone" className="col-md-2 col-form-label text-muted">
                            Phone
                        </label>
                        <div className="col-md-8">
                            <input
                                type="tel"
                                className="form-control"
                                id="phone"
                                name="phone"
                                value={settings.phone_no}
                                disabled
                            />
                        </div>
                    </div>
                    <hr />

                    {/* Name Field */}
                    <div className="mb-3 row">
                    <div className="mb-3 p-2" style={{ backgroundColor: "#E5EAEC", borderRadius: "5px" }}>
                            <span className="text-muted">UserInfo</span>
                        </div>

                        <label htmlFor="name" className="col-md-2 col-form-label text-muted">
                            Name
                        </label>
                        <div className="col-md-8">
                            <input
                                type="text"
                                className="form-control"
                                id="name"
                                name="name"
                                value={settings.name}
                                onChange={(e) => setSettings({ ...settings, name: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="d-flex justify-content-start mt-3">
                        <button
                            type="button"
                            className="btn btn-lg"
                            style={{ backgroundColor: "#419EB9", color: "white" }}
                            onClick={handleNameUpdate}
                            disabled={isLoading}
                        >
                            {isLoading ? "Updating..." : "Update "}
                        </button>
                    </div>
                    <hr />

                    {/* Password Section */}
                    <div>
                        <div className="mb-3 p-2" style={{ backgroundColor: "#E5EAEC", borderRadius: "5px" }}>
                            <span className="text-muted">Password</span>
                        </div>
                        <div className="row mt-2">
                            <div className="col-md-12">
                                <input
                                    type="password"
                                    className="form-control mb-2"
                                    id="currentPassword"
                                    name="currentPassword"
                                    placeholder="Current Password"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                />
                            </div>
                            <div className="col-md-12">
                                <input
                                    type="password"
                                    className="form-control mb-2"
                                    id="newPassword"
                                    name="newPassword"
                                    placeholder="New Password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                />
                            </div>
                            <div className="col-md-12">
                                <input
                                    type="password"
                                    className="form-control"
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    placeholder="Confirm New Password"
                                    value={confirmNewPassword}
                                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="d-flex justify-content-start mt-3">
                        <button
                            type="button"
                            className="btn btn-lg"
                            style={{ backgroundColor: "#419EB9", color: "white" }}
                            onClick={handlePasswordUpdate}
                            disabled={isLoading}
                        >
                            {isLoading ? "Updating..." : "Update Password"}
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Settings;
