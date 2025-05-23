import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Camera, X, Edit, Save, Lock, User, Clock, Eye, EyeOff } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTeacherById, useTeacherUpdate } from "@/config/Api/useTeacher";

interface ITeacher {
  id: number;
  teacher_code: string;
  name: string;
  nip: number | null;
  email: string | null;
  created_at: string;
  updated_at: string;
  last_active?: string;
  classes?: Array<{ id: string | number; name?: string }>;
}

type InputValueType = string | number | null;

const formatDate = (dateString: string): string => {
  if (!dateString) return "N/A";
  
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (error) {
    console.error("Error format tanggal:", error);
    return "Tanggal tidak valid";
  }
};

const ViewProfileTeacher = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<ITeacher | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [lastActive, setLastActive] = useState<string>("14.50 di Menu Siswa");
  const [photoUrl, setPhotoUrl] = useState<string | undefined>(undefined);
  
  const teacherId = localStorage.getItem('teacher_id');
  
  const updateMutation = useTeacherUpdate();
  
  useEffect(() => {
    if (!teacherId) {
      navigate('/login');
    }
  }, [teacherId, navigate]);
  
  const { 
    data: teacher, 
    isLoading,
    refetch
  } = useTeacherById(teacherId ? Number(teacherId) : 0);
  
  useEffect(() => {
    if (teacher) {
      setFormData(teacher);
      if (teacher.last_active) {
        setLastActive(teacher.last_active);
      }
    }
  }, [teacher]);

  useEffect(() => {
    if (!isEditing) {
      setPassword("");
      setConfirmPassword("");
      setPasswordError("");
      setShowPassword(false);
      setShowConfirmPassword(false);
    }
  }, [isEditing]);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const handleChangeAvatar = () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.onchange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      if (target && target.files && target.files.length > 0) {
        try {
          const file = target.files[0];
          const localUrl = URL.createObjectURL(file);
          setPhotoUrl(localUrl);
          setSuccessMessage("Foto profil berhasil diperbarui!");
        } catch (error) {
          console.error("Error memperbarui foto:", error);
        }
      }
    };
    fileInput.click();
  };

  const handleDeleteAvatar = () => {
    if (window.confirm("Yakin ingin menghapus foto profil?")) {
      try {
        setPhotoUrl(undefined);
        setSuccessMessage("Foto profil berhasil dihapus!");
      } catch (error) {
        console.error("Error menghapus foto:", error);
      }
    }
  };

  const handleInputChange = (field: string, value: InputValueType) => {
    if (formData) {
      setFormData({
        ...formData,
        [field]: value
      });
    }
  };

  const toggleEditMode = () => {
    setIsEditing(!isEditing);
    if (isEditing && teacher) {
      setFormData(teacher);
    }
  };

  const togglePasswordVisibility = (field: 'password' | 'confirmPassword') => {
    if (field === 'password') {
      setShowPassword(!showPassword);
    } else {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  const validatePasswords = (): boolean => {
    if (password && password.length < 6) {
      setPasswordError("Password harus minimal 6 karakter");
      return false;
    }
    
    if (password && password !== confirmPassword) {
      setPasswordError("Password tidak cocok");
      return false;
    }
    
    setPasswordError("");
    return true;
  };

  const handleSaveChanges = () => {
    if (!formData || !teacherId) return;
    
    const updateData = {
      name: formData.name,
      teacher_code: formData.teacher_code,
      email: formData.email,
      nip: formData.nip
    };
    
    updateMutation.mutate({
      id: Number(teacherId),
      data: updateData
    }, {
      onSuccess: () => {
        setSuccessMessage("Data profil berhasil diperbarui!");
        setIsEditing(false);
        refetch();
      },
      onError: () => {
        setSuccessMessage("Gagal memperbarui profil. Coba lagi.");
      }
    });
  };

  const handleUpdatePassword = () => {
    if (!password) {
      setPasswordError("Masukkan password baru");
      return;
    }
    
    if (!validatePasswords() || !teacherId) {
      return;
    }
    
    updateMutation.mutate({
      id: Number(teacherId),
      data: { password } as any
    }, {
      onSuccess: () => {
        setSuccessMessage("Password berhasil diperbarui!");
        setPassword("");
        setConfirmPassword("");
      },
      onError: () => {
        setPasswordError("Gagal memperbarui password. Coba lagi.");
      }
    });
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <style jsx>{`
          .clean-loader {
            width: 58px;
            height: 58px;
            border: 4px solid #e5e7eb;
            border-top: 4px solid #10b981;
            border-radius: 50%;
            animation: cleanSpin 1s linear infinite;
          }
          
          @keyframes cleanSpin {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }
        `}</style>
        <div className="clean-loader"></div>
      </div>
    );
  }
  
  if (!teacher || !formData) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <p className="text-red-600 text-lg font-medium">Gagal memuat data profil</p>
        <button 
          className="mt-4 px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-all"
          onClick={() => navigate('/')}
        >
          Kembali ke Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-4 sm:py-6 px-3 sm:px-4 text-black">
      {successMessage && (
        <div className="mb-4 sm:mb-6 p-3 bg-green-100 text-green-800 rounded-lg flex justify-between items-center">
          <div className="flex items-center">
            <span className="mr-2">✓</span>
            {successMessage}
          </div>
          <button 
            onClick={() => setSuccessMessage("")}
            className="text-green-800"
          >
            <X size={16} />
          </button>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 sm:mb-8 gap-3">
        <h1 className="text-3xl sm:text-4xl font-bold text-black">Biodata Guru</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(250px,300px)_1fr] gap-4 sm:gap-6 lg:gap-8">
        <div className="space-y-4 sm:space-y-6">
          <Card className="shadow-sm border border-gray-200 bg-white rounded-lg overflow-hidden">
            <CardHeader className="bg-white py-3 px-4">
              <CardTitle className="text-center text-black">Foto Profil</CardTitle>
              <div className="relative flex justify-center mt-5">
                <div className="absolute w-64 h-0.5 bg-green-400 rounded-full shadow-sm mt-1"></div>
              </div>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 flex flex-col items-center">
              <div className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 rounded-full bg-gray-200 flex items-center justify-center mb-4 sm:mb-6 border-4 border-green-100 overflow-hidden">
                {photoUrl ? (
                  <img 
                    src={photoUrl} 
                    alt="Teacher profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 text-gray-400" strokeWidth={1} />
                )}
              </div>

              <div className="space-y-2 w-full">
                <button 
                  onClick={handleChangeAvatar}
                  className="w-full py-2 bg-green-600 text-white rounded-lg flex items-center justify-center gap-2 hover:bg-green-700 transition-all"
                >
                  <Camera size={16} className="inline" />
                  <span>Ubah Foto</span>
                </button>
                <button 
                  onClick={handleDeleteAvatar}
                  className="w-full py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
                >
                  Hapus Foto
                </button>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border border-gray-200 bg-white rounded-lg overflow-hidden">
            <CardHeader className="bg-white py-3 px-4">
              <CardTitle className="text-center text-black">Kelas yang Diajarkan</CardTitle>
              <div className="relative flex justify-center mt-5">
                <div className="absolute w-64 h-0.5 bg-green-400 rounded-full shadow-sm mt-1"></div>
              </div>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              {formData.classes && formData.classes.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {formData.classes.map((classItem, index) => (
                    <span 
                      key={index}
                      className="px-3 py-1.5 bg-green-500 text-white text-sm rounded-lg inline-flex items-center"
                    >
                      {classItem.name || classItem.id}
                    </span>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-gray-500">
                  <p>Belum ada kelas yang diajarkan</p>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="rounded-lg bg-white border border-gray-200 shadow-sm p-3 flex items-center text-sm text-gray-600">
            <Clock size={16} className="mr-2 text-green-600" />
            Terakhir aktif pada {lastActive}
          </div>
        </div>

        <div className="space-y-4 sm:space-y-6">
          <Card className="shadow-sm border border-gray-200 bg-white rounded-lg overflow-hidden">
            <CardHeader className="bg-white py-3 px-4">
              <CardTitle className="text-black flex items-center">
                <User className="mr-2 h-5 w-5" />
                Informasi Pribadi
              </CardTitle>
              <div className="relative flex justify-center mt-5">
                <div className="absolute w-full h-0.5 bg-green-400 rounded-full shadow-sm mt-1"></div>
              </div>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              <div className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label htmlFor="teacher-nip" className="block text-sm font-medium text-black mb-1">NIP</label>
                    {isEditing ? (
                      <input
                        id="teacher-nip"
                        type="number"
                        value={formData.nip || ''}
                        onChange={(e) => handleInputChange('nip', e.target.value ? Number(e.target.value) : null)}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                      />
                    ) : (
                      <div className="p-2 bg-gray-100 border border-gray-200 rounded-lg">{formData.nip || "Tidak diatur"}</div>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="teacher-code" className="block text-sm font-medium text-black mb-1">Kode Guru</label>
                    {isEditing ? (
                      <input
                        id="teacher-code"
                        type="text"
                        value={formData.teacher_code || ''}
                        onChange={(e) => handleInputChange('teacher_code', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                      />
                    ) : (
                      <div className="p-2 bg-gray-100 border border-gray-200 rounded-lg">{formData.teacher_code}</div>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="teacher-name" className="block text-sm font-medium text-black mb-1">Nama</label>
                  {isEditing ? (
                    <input
                      id="teacher-name"
                      type="text"
                      value={formData.name || ''}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                      required
                    />
                  ) : (
                    <div className="p-2 bg-gray-100 border border-gray-200 rounded-lg">{formData.name}</div>
                  )}
                </div>

                <div>
                  <label htmlFor="teacher-email" className="block text-sm font-medium text-black mb-1">Email</label>
                  {isEditing ? (
                    <input
                      id="teacher-email"
                      type="email"
                      value={formData.email || ''}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                    />
                  ) : (
                    <div className="p-2 bg-gray-100 border border-gray-200 rounded-lg">{formData.email || "Tidak diatur"}</div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-sm font-medium text-black mb-1">Dibuat Pada</label>
                    <div className="p-2 bg-gray-100 border border-gray-200 rounded-lg">
                      {formatDate(formData.created_at)}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-black mb-1">Diperbarui Pada</label>
                    <div className="p-2 bg-gray-100 border border-gray-200 rounded-lg">
                      {formatDate(formData.updated_at)}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end mt-4">
                  {!isEditing ? (
                    <button
                      onClick={toggleEditMode}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg flex items-center justify-center gap-2 hover:bg-green-700 transition-all"
                    >
                      <Edit size={18} />
                      Edit Profil
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={() => setIsEditing(false)}
                        className="px-4 py-2 bg-gray-500 text-white rounded-lg flex items-center justify-center gap-2 hover:bg-gray-600 transition-all"
                      >
                        <X size={18} />
                        Batal
                      </button>
                      <button
                        onClick={handleSaveChanges}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg flex items-center justify-center gap-2 hover:bg-green-700 transition-all"
                      >
                        <Save size={18} />
                        Simpan
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border border-gray-200 bg-white rounded-lg overflow-hidden">
            <CardHeader className="bg-white py-3 px-4">
              <CardTitle className="text-black flex items-center">
                <Lock className="mr-2 h-5 w-5" />
                Manajemen Password
              </CardTitle>
              <div className="relative flex justify-center mt-5">
                <div className="absolute w-full h-0.5 bg-green-400 rounded-full shadow-sm mt-1"></div>
              </div>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-black mb-1">Password Baru</label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none pr-10"
                      placeholder="Masukkan password baru"
                    />
                    <button 
                      type="button"
                      onClick={() => togglePasswordVisibility('password')}
                      className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-black mb-1">Konfirmasi Password Baru</label>
                  <div className="relative">
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={`w-full p-2 border rounded-lg focus:ring-2 outline-none pr-10 ${
                        passwordError ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-green-500 focus:border-green-500'
                      }`}
                      placeholder="Konfirmasi password baru"
                    />
                    <button 
                      type="button"
                      onClick={() => togglePasswordVisibility('confirmPassword')}
                      className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 hover:text-gray-700"
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {passwordError && (
                    <p className="mt-1 text-sm text-red-600" role="alert">{passwordError}</p>
                  )}
                </div>

                <div className="text-sm text-gray-600 mb-2">
                  <p>Persyaratan password:</p>
                  <ul className="list-disc pl-6 mt-1">
                    <li>Minimal 6 karakter</li>
                    <li>Kedua password harus cocok</li>
                  </ul>
                </div>

                <div className="flex justify-end">
                  <button 
                    onClick={handleUpdatePassword}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg flex items-center gap-2 hover:bg-green-700 transition-all"
                    disabled={!password || !confirmPassword}
                  >
                    <Lock size={16} />
                    Perbarui Password
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ViewProfileTeacher;