'use client';

import React, { useState, useRef, useEffect } from "react";
import InspiraNavbar from '../components/button';

const ReferForm = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [ticketType, setTicketType] = useState("ไม่มีค่าเข้าชม");

  const [formData, setFormData] = useState({
    name: "",
    location: "",
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
    primaryCategory: "",
    secondaryCategory: "",
    description: "",
    ticket: "ไม่มีค่าเข้าชม",
    ticketPrice: "",
    latitude: "",
    longitude: "",
    picture: null as File | null,
  });

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/categories`);
        const data = await res.json();
        setCategories(data.map((c: any) => c.name));
      } catch (err) {
        console.error("❌ โหลดหมวดหมู่ไม่สำเร็จ", err);
      }
    };
    loadCategories();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, files } = e.target as HTMLInputElement;
    if (name === "ticket") setTicketType(value);
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // ✅ ตรวจสอบช่องที่จำเป็น
    const requiredFields = [
      { key: "name", label: "ชื่อ" },
      { key: "location", label: "สถานที่" },
      { key: "startDate", label: "วันที่เริ่มต้น" },
      { key: "endDate", label: "วันที่สิ้นสุด" },
      { key: "description", label: "รายละเอียด" },
      { key: "primaryCategory", label: "หมวดหมู่หลัก" },
      { key: "ticket", label: "ค่าเข้าชม" },
    ];
    for (const field of requiredFields) {
      const val = (formData as any)[field.key];
      if (!val || val.toString().trim() === "") {
        alert(`❌ กรุณากรอก ${field.label}`);
        return;
      }
    }

    if (!formData.picture) {
      alert("❌ กรุณาเลือกรูปภาพ");
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);

    if (start < today) {
      alert("❌ วันที่เริ่มต้นต้องไม่น้อยกว่าวันปัจจุบัน");
      return;
    }

    if (start > end) {
      alert("❌ วันที่เริ่มต้นต้องไม่เกินวันที่สิ้นสุด");
      return;
    }

    if (formData.startTime && formData.endTime) {
      const [sh, sm] = formData.startTime.split(":").map(Number);
      const [eh, em] = formData.endTime.split(":").map(Number);
      if (eh * 60 + em <= sh * 60 + sm) {
        alert("❌ เวลาสิ้นสุดต้องมากกว่าเวลาเริ่มต้น");
        return;
      }
    }

    const eventSlot = formData.startTime && formData.endTime
      ? `${formData.startTime}-${formData.endTime}`
      : formData.startTime || "";

    const categories: string[] = [];
    if (formData.primaryCategory) categories.push(formData.primaryCategory);
    if (
      formData.secondaryCategory &&
      formData.secondaryCategory !== formData.primaryCategory
    )
      categories.push(formData.secondaryCategory);

    const data = new FormData();
    data.append("title", formData.name);
    data.append("location", formData.location);
    data.append("start_date", formData.startDate);
    data.append("end_date", formData.endDate);
    data.append("event_slot_time", eventSlot);
    data.append("description", formData.description);
    data.append("ticket", formData.ticket);
    if (formData.ticket === "มีค่าเข้าชม") {
      data.append("ticket_price", formData.ticketPrice);
    }
    data.append("latitude", formData.latitude);
    data.append("longitude", formData.longitude);
    data.append("image", formData.picture!);
    categories.forEach((c) => data.append("categories[]", c));

    const token = localStorage.getItem("token");
    if (!token) {
      alert("❌ กรุณาเข้าสู่ระบบก่อนส่งข้อมูล");
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/suggestions`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: data,
      });
      const result = await res.json();
      if (result.success) {
        alert("✅ ส่งข้อมูลเรียบร้อยแล้ว");
        formRef.current?.reset();
      } else {
        alert("❌ ไม่สามารถส่งข้อมูล: " + (result.error || "เกิดข้อผิดพลาด"));
      }
    } catch (err) {
      console.error(err);
      alert("❌ ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์");
    }
  };

  const submitForm = () => {
    formRef.current?.requestSubmit();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="fixed top-0 left-0 w-full z-50 bg-white shadow">
        <InspiraNavbar />
      </div>

      <div className="h-[64px]" />
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h2 className="text-xl font-semibold text-[#5b78a4] mb-4">Refer</h2>
        <p className="text-gray-600 mb-4">Please fill in the details below to refer an exhibition.</p>

        <form ref={formRef} onSubmit={handleSubmit} className="w-1/2 max-w-md bg-white shadow-xl rounded-2xl p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Name *</label>
            <input type="text" name="name" required onChange={handleChange} className="w-full p-3 bg-gray-100 rounded-md" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Location *</label>
            <input type="text" name="location" required onChange={handleChange} className="w-full p-3 bg-gray-100 rounded-md" />
          </div>

          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1 text-gray-700">Start date *</label>
              <input type="date" name="startDate" required onChange={handleChange} className="w-full p-3 bg-gray-100 rounded-md text-gray-400" />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1 text-gray-700">End date *</label>
              <input type="date" name="endDate" required onChange={handleChange} className="w-full p-3 bg-gray-100 rounded-md text-gray-400" />
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1  text-gray-700">Start time</label>
              <input type="time" name="startTime" onChange={handleChange} className="w-full p-3 bg-gray-100 rounded-md text-gray-400" />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1 text-gray-700">End time</label>
              <input type="time" name="endTime" onChange={handleChange} className="w-full p-3 bg-gray-100 rounded-md text-gray-400" />
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1 text-gray-700">Primary Category *</label>
              <select name="primaryCategory" required onChange={handleChange} className="w-full p-3 bg-gray-100 rounded-md">
                <option value="">-- เลือกหมวดหมู่ --</option>
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">Secondary Category</label>
              <select name="secondaryCategory" onChange={handleChange} className="w-full p-3 bg-gray-100 rounded-md">
                <option value="">-- ไม่เลือกก็ได้ --</option>
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Description *</label>
            <textarea name="description" required rows={3} onChange={handleChange} className="w-full p-3 bg-gray-100 rounded-md resize-none" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Ticket *</label>
            <select name="ticket" required onChange={handleChange} className="w-full p-3 bg-gray-100 rounded-md">
              <option value="ไม่มีค่าเข้าชม">ไม่มีค่าเข้าชม</option>
              <option value="มีค่าเข้าชม">มีค่าเข้าชม</option>
            </select>
          </div>

          {ticketType === "มีค่าเข้าชม" && (
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Ticket price * (100,200,300)</label>
              <input type="text" name="ticketPrice" onChange={handleChange} className="w-full p-3 bg-gray-100 rounded-md" />
            </div>
          )}

          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1  text-gray-700">Latitude</label>
              <input type="text" name="latitude" onChange={handleChange} className="w-full p-3 bg-gray-100 rounded-md" />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1 text-gray-700">Longitude</label>
              <input type="text" name="longitude" onChange={handleChange} className="w-full p-3 bg-gray-100 rounded-md" />
            </div>
          </div>

          <label className="block text-sm font-medium mb-1 text-gray-700">Picture *</label>
          <div className="relative flex items-center">
            <input
              type="file"
              accept="image/*"
              name="picture"
              required
              onChange={handleChange}
              className="w-full file:hidden p-3 bg-gray-100 rounded-md text-gray-400"
            />
            <div className="absolute right-2 pointer-events-none text-gray-500">📷</div>
          </div>
        </form>

        <button
          onClick={submitForm}
          className="w-full max-w-md mt-4 bg-[#5b78a4] text-white py-2 rounded-lg hover:bg-[#4a6795] transition"
        >
          Refer
        </button>
      </div>
    </div>
  );
};

export default ReferForm;
