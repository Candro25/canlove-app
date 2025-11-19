import React, { useState, useEffect, useRef } from 'react';
import { Heart, User, Mail, Calendar, Image, LogIn, UserPlus, Home, Sparkles, MessageCircle, X, Send, ArrowLeft, Video, Phone, Mic, MicOff, VideoOff, PhoneOff, Crown, Check, Star } from 'lucide-react';

const DEFAULT_PHOTO = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23FEF3C7" width="200" height="200"/%3E%3Ctext fill="%23D97706" font-family="sans-serif" font-size="16" dy="10.5" font-weight="bold" x="50%25" y="50%25" text-anchor="middle"%3ESin Foto%3C/text%3E%3C/svg%3E';

const DEMO_USERS = [
  { name: 'Ana García', age: '24', gender: 'mujer', bio: 'Amante del café y los atardeceres. Viajera empedernida 🌎', photo: 'https://i.pravatar.cc/300?img=5' },
  { name: 'Carlos Ruiz', age: '28', gender: 'hombre', bio: 'Chef aficionado y músico. Me encanta cocinar para otros 🍳', photo: 'https://i.pravatar.cc/300?img=12' },
  { name: 'María López', age: '26', gender: 'mujer', bio: 'Diseñadora gráfica. Arte, películas y buen vino 🎨', photo: 'https://i.pravatar.cc/300?img=9' },
  { name: 'Diego Santos', age: '30', gender: 'hombre', bio: 'Ingeniero de día, DJ de noche. Vida fitness 💪', photo: 'https://i.pravatar.cc/300?img=15' },
  { name: 'Laura Méndez', age: '23', gender: 'mujer', bio: 'Escritora y lectora compulsiva. Amo los perros 📚🐕', photo: 'https://i.pravatar.cc/300?img=10' },
  { name: 'Andrés Vega', age: '27', gender: 'hombre', bio: 'Fotógrafo profesional. Capturo momentos únicos 📸', photo: 'https://i.pravatar.cc/300?img=13' },
  { name: 'Sofía Ramírez', age: '25', gender: 'mujer', bio: 'Bailarina de salsa. La música es mi vida 💃', photo: 'https://i.pravatar.cc/300?img=20' },
  { name: 'Roberto Torres', age: '29', gender: 'hombre', bio: 'Emprendedor tech. Startups y café ☕️', photo: 'https://i.pravatar.cc/300?img=33' },
  { name: 'Valentina Cruz', age: '22', gender: 'mujer', bio: 'Estudiante de medicina. Salvar vidas es mi pasión ❤️', photo: 'https://i.pravatar.cc/300?img=23' },
  { name: 'Fernando Díaz', age: '31', gender: 'hombre', bio: 'Arquitecto. Construyo sueños, uno a la vez 🏗️', photo: 'https://i.pravatar.cc/300?img=51' }
];

export default function CanLoveApp() {
  const [currentView, setCurrentView] = useState('welcome');
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [photoPreview, setPhotoPreview] = useState('');
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0);
  const [likes, setLikes] = useState([]);
  const [passes, setPasses] = useState([]);
  const [matches, setMatches] = useState([]);
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [newMatch, setNewMatch] = useState(null);
  const [selectedChat, setSelectedChat] = useState(null);
  const [conversations, setConversations] = useState({});
  const [unreadCounts, setUnreadCounts] = useState({});
  const [isInCall, setIsInCall] = useState(false);
  const [localStream, setLocalStream] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [callPartner, setCallPartner] = useState(null);
  const [isPremium, setIsPremium] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [dailyLikesCount, setDailyLikesCount] = useState(0);
  const [showInterstitialAd, setShowInterstitialAd] = useState(false);
  const [profilesViewedCount, setProfilesViewedCount] = useState(0);

  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const ageRef = useRef(null);
  const genderRef = useRef(null);
  const bioRef = useRef(null);
  const chatEndRef = useRef(null);
  const messageInputRef = useRef(null);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (selectedChat && chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [conversations, selectedChat]);

  useEffect(() => {
    if (!selectedChat && localStream) {
      endCall();
    }
  }, [selectedChat]);

  const loadData = () => {
    try {
      let savedUsers = localStorage.getItem('canlove_users');
      if (!savedUsers) {
        const demoUsersWithIds = DEMO_USERS.map((user, index) => ({
          id: `demo_${Date.now()}_${index}`,
          ...user,
          email: `${user.name.toLowerCase().replace(' ', '')}@demo.com`,
          password: '123456',
          createdAt: new Date().toISOString()
        }));
        localStorage.setItem('canlove_users', JSON.stringify(demoUsersWithIds));
        setUsers(demoUsersWithIds);
      } else {
        setUsers(JSON.parse(savedUsers));
      }
      const savedCurrentUser = localStorage.getItem('canlove_current_user');
      if (savedCurrentUser) {
        const userData = JSON.parse(savedCurrentUser);
        setCurrentUser(userData);
        setCurrentView('discover');
        setIsPremium(userData.isPremium || false);
        loadUserInteractions(userData.id);
        loadConversations(userData.id);
      }
    } catch (error) {
      console.error('Error cargando datos:', error);
    }
    setLoading(false);
  };

  const loadUserInteractions = (userId) => {
    try {
      const savedLikes = localStorage.getItem(`canlove_likes_${userId}`);
      const savedPasses = localStorage.getItem(`canlove_passes_${userId}`);
      const savedMatches = localStorage.getItem(`canlove_matches_${userId}`);
      if (savedLikes) setLikes(JSON.parse(savedLikes));
      if (savedPasses) setPasses(JSON.parse(savedPasses));
      if (savedMatches) setMatches(JSON.parse(savedMatches));
      const currentCount = parseInt(localStorage.getItem(`canlove_daily_likes_${userId}`) || '0');
      setDailyLikesCount(currentCount);
    } catch (error) {
      console.error('Error cargando interacciones:', error);
    }
  };

  const loadConversations = (userId) => {
    try {
      const savedConversations = localStorage.getItem(`canlove_conversations_${userId}`);
      if (savedConversations) {
        const convos = JSON.parse(savedConversations);
        setConversations(convos);
        const unread = {};
        Object.keys(convos).forEach(matchId => {
          const unreadCount = convos[matchId].filter(msg => !msg.read && msg.senderId !== userId).length;
          if (unreadCount > 0) unread[matchId] = unreadCount;
        });
        setUnreadCounts(unread);
      }
    } catch (error) {
      console.error('Error cargando conversaciones:', error);
    }
  };

  const saveUserInteractions = (userId, newLikes, newPasses, newMatches) => {
    localStorage.setItem(`canlove_likes_${userId}`, JSON.stringify(newLikes));
    localStorage.setItem(`canlove_passes_${userId}`, JSON.stringify(newPasses));
    localStorage.setItem(`canlove_matches_${userId}`, JSON.stringify(newMatches));
  };

  const saveConversations = (userId, convos) => {
    localStorage.setItem(`canlove_conversations_${userId}`, JSON.stringify(convos));
    setConversations(convos);
  };

  const saveUsers = (newUsers) => {
    try {
      localStorage.setItem('canlove_users', JSON.stringify(newUsers));
      setUsers(newUsers);
    } catch (error) {
      console.error('Error guardando usuarios:', error);
    }
  };

  const saveCurrentUser = (user) => {
    try {
      localStorage.setItem('canlove_current_user', JSON.stringify(user));
      setCurrentUser(user);
      setIsPremium(user.isPremium || false);
      loadUserInteractions(user.id);
      loadConversations(user.id);
    } catch (error) {
      console.error('Error guardando sesión:', error);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPhotoPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleRegister = () => {
    const name = nameRef.current?.value?.trim() || '';
    const email = emailRef.current?.value?.trim() || '';
    const password = passwordRef.current?.value || '';
    const age = ageRef.current?.value || '';
    const gender = genderRef.current?.value || '';
    const bio = bioRef.current?.value?.trim() || '';

    if (!name || !email || !age || !gender || !password) {
      alert('Por favor completa todos los campos obligatorios');
      return;
    }
    if (parseInt(age) < 18) {
      alert('Debes ser mayor de 18 años');
      return;
    }
    if (password.length < 6) {
      alert('La contraseña debe tener mínimo 6 caracteres');
      return;
    }
    if (users.find(u => u.email === email)) {
      alert('Este email ya está registrado');
      return;
    }

    const newUser = {
      id: Date.now().toString(),
      name, email, password, age, gender, bio,
      photo: photoPreview || DEFAULT_PHOTO,
      createdAt: new Date().toISOString(),
      isPremium: false,
      premiumUntil: null
    };

    const updatedUsers = [...users, newUser];
    saveUsers(updatedUsers);
    saveCurrentUser(newUser);
    alert(`¡Bienvenido ${newUser.name}!`);
    if (nameRef.current) nameRef.current.value = '';
    if (emailRef.current) emailRef.current.value = '';
    if (passwordRef.current) passwordRef.current.value = '';
    if (ageRef.current) ageRef.current.value = '';
    if (genderRef.current) genderRef.current.value = '';
    if (bioRef.current) bioRef.current.value = '';
    setPhotoPreview('');
    setCurrentView('discover');
  };

  const handleLogin = () => {
    const email = emailRef.current?.value?.trim() || '';
    const password = passwordRef.current?.value || '';
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      saveCurrentUser(user);
      if (emailRef.current) emailRef.current.value = '';
      if (passwordRef.current) passwordRef.current.value = '';
      setCurrentView('discover');
      alert(`¡Bienvenido de nuevo ${user.name}!`);
    } else {
      alert('Email o contraseña incorrectos');
    }
  };

  const handleLogout = () => {
    if (!window.confirm('¿Seguro que quieres cerrar sesión?')) return;
    localStorage.removeItem('canlove_current_user');
    setCurrentUser(null);
    setLikes([]);
    setPasses([]);
    setMatches([]);
    setConversations({});
    setUnreadCounts({});
    setIsPremium(false);
    setDailyLikesCount(0);
    setCurrentView('welcome');
    alert('Sesión cerrada');
  };

  const getAvailableProfiles = () => {
    return users.filter(u => u.id !== currentUser?.id && !likes.includes(u.id) && !passes.includes(u.id));
  };

  const handleLike = () => {
    if (!isPremium) {
      const today = new Date().toDateString();
      const lastLikeDate = localStorage.getItem(`canlove_last_like_date_${currentUser.id}`);
      if (lastLikeDate !== today) {
        setDailyLikesCount(0);
        localStorage.setItem(`canlove_last_like_date_${currentUser.id}`, today);
      }
      const currentCount = parseInt(localStorage.getItem(`canlove_daily_likes_${currentUser.id}`) || '0');
      if (currentCount >= 10) {
        setShowPremiumModal(true);
        return;
      }
      localStorage.setItem(`canlove_daily_likes_${currentUser.id}`, (currentCount + 1).toString());
      setDailyLikesCount(currentCount + 1);
    }
    const availableProfiles = getAvailableProfiles();
    if (availableProfiles.length === 0) return;
    const likedUser = availableProfiles[currentProfileIndex];
    const newLikes = [...likes, likedUser.id];
    const otherUserLikes = JSON.parse(localStorage.getItem(`canlove_likes_${likedUser.id}`) || '[]');
    if (otherUserLikes.includes(currentUser.id)) {
      const newMatches = [...matches, likedUser.id];
      setMatches(newMatches);
      setNewMatch(likedUser);
      setShowMatchModal(true);
      const otherUserMatches = JSON.parse(localStorage.getItem(`canlove_matches_${likedUser.id}`) || '[]');
      localStorage.setItem(`canlove_matches_${likedUser.id}`, JSON.stringify([...otherUserMatches, currentUser.id]));
      saveUserInteractions(currentUser.id, newLikes, passes, newMatches);
    } else {
      setLikes(newLikes);
      saveUserInteractions(currentUser.id, newLikes, passes, matches);
    }
    setCurrentProfileIndex(0);
    checkAndShowAd();
  };

  const handlePass = () => {
    const availableProfiles = getAvailableProfiles();
    if (availableProfiles.length === 0) return;
    const passedUser = availableProfiles[currentProfileIndex];
    const newPasses = [...passes, passedUser.id];
    setPasses(newPasses);
    saveUserInteractions(currentUser.id, likes, newPasses, matches);
    setCurrentProfileIndex(0);
    checkAndShowAd();
  };

  const sendMessage = () => {
    const text = messageInputRef.current?.value?.trim();
    if (!text || !selectedChat) return;
    const message = {
      id: Date.now().toString(),
      text,
      senderId: currentUser.id,
      receiverId: selectedChat.id,
      timestamp: new Date().toISOString(),
      read: false
    };
    const myConvos = { ...conversations };
    if (!myConvos[selectedChat.id]) myConvos[selectedChat.id] = [];
    myConvos[selectedChat.id].push(message);
    saveConversations(currentUser.id, myConvos);
    const otherUserConvos = JSON.parse(localStorage.getItem(`canlove_conversations_${selectedChat.id}`) || '{}');
    if (!otherUserConvos[currentUser.id]) otherUserConvos[currentUser.id] = [];
    otherUserConvos[currentUser.id].push(message);
    localStorage.setItem(`canlove_conversations_${selectedChat.id}`, JSON.stringify(otherUserConvos));
    if (messageInputRef.current) {
      messageInputRef.current.value = '';
      messageInputRef.current.focus();
    }
  };

  const markAsRead = (matchId) => {
    const myConvos = { ...conversations };
    if (myConvos[matchId]) {
      myConvos[matchId] = myConvos[matchId].map(msg => ({
        ...msg,
        read: msg.receiverId === currentUser.id ? true : msg.read
      }));
      saveConversations(currentUser.id, myConvos);
      const newUnread = { ...unreadCounts };
      delete newUnread[matchId];
      setUnreadCounts(newUnread);
    }
  };

  const openChat = (match) => {
    setSelectedChat(match);
    markAsRead(match.id);
    setCurrentView('chat');
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  const getLastMessage = (matchId) => {
    const convos = conversations[matchId] || [];
    if (convos.length === 0) return 'Empezar conversación';
    const lastMsg = convos[convos.length - 1];
    return lastMsg.text.length > 30 ? lastMsg.text.substring(0, 30) + '...' : lastMsg.text;
  };

  const getTotalUnread = () => {
    return Object.values(unreadCounts).reduce((sum, count) => sum + count, 0);
  };

  const startVideoCall = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setLocalStream(stream);
      setIsInCall(true);
      setCallPartner(selectedChat);
      alert(`Llamando a ${selectedChat.name}...`);
    } catch (error) {
      alert('No se pudo acceder a la cámara/micrófono');
    }
  };

  const startAudioCall = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: false, audio: true });
      setLocalStream(stream);
      setIsInCall(true);
      setIsVideoOff(true);
      setCallPartner(selectedChat);
      alert(`Llamando a ${selectedChat.name}...`);
    } catch (error) {
      alert('No se pudo acceder al micrófono');
    }
  };

  const endCall = () => {
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
    }
    setLocalStream(null);
    setIsInCall(false);
    setIsMuted(false);
    setIsVideoOff(false);
    setCallPartner(null);
  };

  const toggleMute = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMuted(!audioTrack.enabled);
      }
    }
  };

  const toggleVideo = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoOff(!videoTrack.enabled);
      }
    }
  };

  const upgradeToPremium = () => {
    const confirmPayment = window.confirm('💳 PAGO SIMULADO\n\nPlan Premium: $9.99/mes\n\n¿Confirmar?');
    if (confirmPayment) {
      const updatedUser = {
        ...currentUser,
        isPremium: true,
        premiumUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      };
      const updatedUsers = users.map(u => u.id === currentUser.id ? updatedUser : u);
      saveUsers(updatedUsers);
      saveCurrentUser(updatedUser);
      setShowPremiumModal(false);
      alert('🎉 ¡Bienvenido a Premium!');
    }
  };

  const openPremiumScreen = () => setShowPremiumModal(true);

  const checkAndShowAd = () => {
    if (isPremium) return;
    const newCount = profilesViewedCount + 1;
    setProfilesViewedCount(newCount);
    if (newCount % 5 === 0) {
      setShowInterstitialAd(true);
      setTimeout(() => setShowInterstitialAd(false), 5000);
    }
  };

  const AdBanner = () => {
    if (isPremium) return null;
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 my-4 transition-all duration-300 hover:shadow-md">
        <div className="text-center">
          <p className="text-xs text-amber-600 mb-2 font-medium">PUBLICIDAD</p>
          <div className="bg-gradient-to-r from-amber-400 to-orange-500 text-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-bold mb-1">Tu Anuncio Aquí</h3>
            <p className="text-sm opacity-90">Google AdSense</p>
          </div>
          <button onClick={openPremiumScreen} className="text-amber-600 hover:text-amber-700 underline text-xs mt-2 font-medium">
            Eliminar anuncios con Premium
          </button>
        </div>
      </div>
    );
  };

  const InterstitialAd = () => {
    if (!showInterstitialAd) return null;
    return (
      <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4 animate-fadeIn">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center transform transition-all duration-300 scale-100">
          <p className="text-xs text-gray-500 mb-4">PUBLICIDAD</p>
          <div className="bg-gradient-to-r from-amber-400 to-orange-500 text-white p-12 rounded-xl mb-4 shadow-lg">
            <h2 className="text-2xl font-bold mb-2">Tu Anuncio Aquí</h2>
            <p className="text-sm">Google AdSense</p>
          </div>
          <button onClick={() => setShowInterstitialAd(false)} className="text-sm text-gray-600 hover:text-gray-800 font-medium">
            Cerrar anuncio
          </button>
        </div>
      </div>
    );
  };

  const PremiumModal = () => {
    if (!showPremiumModal) return null;
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fadeIn">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full transform transition-all duration-300 scale-100">
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Crown className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Hazte Premium</h2>
            <p className="text-gray-600">Desbloquea todas las funciones</p>
          </div>
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 mb-6 border border-amber-200">
            <div className="text-center mb-4">
              <p className="text-4xl font-bold text-gray-800">$9.99<span className="text-lg text-gray-600">/mes</span></p>
            </div>
            <div className="space-y-3">
              {['Likes ilimitados', 'Ver quién te dio like', 'Sin anuncios', 'Rewind', '5 Super Likes'].map((benefit, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
                    <Check className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-gray-700 font-medium">{benefit}</p>
                </div>
              ))}
            </div>
          </div>
          <button onClick={upgradeToPremium} className="w-full bg-gradient-to-r from-amber-400 to-orange-500 text-white py-4 rounded-full font-bold text-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 mb-3">
            Suscribirme Ahora
          </button>
          <button onClick={() => setShowPremiumModal(false)} className="w-full text-gray-600 py-2 hover:text-gray-800 font-medium">
            Tal vez después
          </button>
        </div>
      </div>
    );
  };

  const VideoCallScreen = () => {
    const videoRef = useRef(null);
    useEffect(() => {
      if (localStream && videoRef.current && !isVideoOff) {
        videoRef.current.srcObject = localStream;
      }
    }, [localStream, isVideoOff]);
    if (!isInCall || !callPartner) return null;
    return (
      <div className="fixed inset-0 bg-black z-50 flex flex-col">
        <div className="bg-gradient-to-b from-black to-transparent p-6 text-white">
          <div className="text-center">
            <img src={callPartner.photo} alt={callPartner.name} className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-amber-400 shadow-lg" />
            <h2 className="text-2xl font-bold">{callPartner.name}</h2>
            <p className="text-sm opacity-75">En llamada...</p>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center relative">
          {isVideoOff ? (
            <div className="text-center">
              <div className="w-32 h-32 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-16 h-16 text-gray-500" />
              </div>
              <p className="text-white">Cámara desactivada</p>
            </div>
          ) : (
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
          )}
          {!isVideoOff && (
            <div className="absolute top-4 right-4 w-32 h-48 bg-gray-900 rounded-lg overflow-hidden shadow-2xl border-2 border-amber-400">
              <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover transform scale-x-[-1]" />
            </div>
          )}
        </div>
        <div className="bg-gradient-to-t from-black to-transparent p-8">
          <div className="flex justify-center gap-4">
            <button onClick={toggleMute} className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 ${isMuted ? 'bg-red-500' : 'bg-gray-700 hover:bg-gray-600'}`}>
              {isMuted ? <MicOff className="w-6 h-6 text-white" /> : <Mic className="w-6 h-6 text-white" />}
            </button>
            <button onClick={toggleVideo} className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 ${isVideoOff ? 'bg-red-500' : 'bg-gray-700 hover:bg-gray-600'}`}>
              {isVideoOff ? <VideoOff className="w-6 h-6 text-white" /> : <Video className="w-6 h-6 text-white" />}
            </button>
            <button onClick={endCall} className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-all duration-300 transform hover:scale-110 shadow-xl">
              <PhoneOff className="w-8 h-8 text-white" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  const MatchModal = () => {
    if (!showMatchModal || !newMatch) return null;
    return (
      <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 animate-fadeIn">
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl p-8 max-w-md w-full text-center transform transition-all duration-300 scale-100 shadow-2xl">
          <div className="mb-6">
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-amber-400 rounded-full animate-ping opacity-75"></div>
              <div className="relative w-24 h-24 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center mx-auto shadow-xl">
                <Star className="w-12 h-12 text-white animate-pulse" />
              </div>
            </div>
          </div>
          <h2 className="text-4xl font-bold text-gray-800 mb-2">¡Es un Match!</h2>
          <p className="text-gray-600 mb-6">A {newMatch.name} también le gustas</p>
          <div className="flex justify-center gap-4 mb-6">
            <img src={currentUser.photo} alt={currentUser.name} className="w-24 h-24 rounded-full border-4 border-amber-400 shadow-lg object-cover" />
            <div className="flex items-center">
              <Heart className="w-8 h-8 text-red-500 animate-pulse" fill="currentColor" />
            </div>
            <img src={newMatch.photo} alt={newMatch.name} className="w-24 h-24 rounded-full border-4 border-amber-400 shadow-lg object-cover" />
          </div>
          <button onClick={() => { setShowMatchModal(false); openChat(newMatch); }} className="w-full bg-gradient-to-r from-amber-400 to-orange-500 text-white py-4 rounded-full font-bold text-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 mb-3">
            Enviar Mensaje
          </button>
          <button onClick={() => setShowMatchModal(false)} className="w-full text-gray-600 py-2 hover:text-gray-800 font-medium">
            Seguir Descubriendo
          </button>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (currentView === 'welcome') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-400 via-orange-400 to-red-400 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-2xl">
              <Heart className="w-12 h-12 text-red-500" fill="currentColor" />
            </div>
            <h1 className="text-5xl font-bold text-white mb-2 drop-shadow-lg">CanLove</h1>
            <p className="text-white text-lg opacity-90">Encuentra tu media naranja 🍊</p>
          </div>
          <div className="bg-white rounded-3xl shadow-2xl p-8 space-y-4">
            <button onClick={() => setCurrentView('login')} className="w-full bg-gradient-to-r from-amber-400 to-orange-500 text-white py-4 rounded-full font-bold text-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2">
              <LogIn className="w-5 h-5" />
              Iniciar Sesión
            </button>
            <button onClick={() => setCurrentView('register')} className="w-full bg-white border-2 border-amber-400 text-amber-600 py-4 rounded-full font-bold text-lg hover:bg-amber-50 transition-all duration-300 flex items-center justify-center gap-2">
              <UserPlus className="w-5 h-5" />
              Crear Cuenta
            </button>
          </div>
          <p className="text-center text-white text-sm mt-6 opacity-75">
            Al continuar, aceptas nuestros términos y condiciones
          </p>
        </div>
      </div>
    );
  }

  if (currentView === 'register') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 p-4">
        <div className="max-w-2xl mx-auto pt-8 pb-20">
          <button onClick={() => setCurrentView('welcome')} className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6">
            <ArrowLeft className="w-5 h-5" />
            Volver
          </button>
          <div className="bg-white rounded-3xl shadow-xl p-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Crear Cuenta</h2>
            <div className="space-y-4">
              <div className="text-center mb-6">
                <div className="w-32 h-32 mx-auto mb-4 relative">
                  <img src={photoPreview || DEFAULT_PHOTO} alt="Vista previa" className="w-full h-full rounded-full object-cover border-4 border-amber-400 shadow-lg" />
                  <label className="absolute bottom-0 right-0 bg-amber-500 p-2 rounded-full cursor-pointer hover:bg-amber-600 transition-colors shadow-lg">
                    <Image className="w-5 h-5 text-white" />
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                </div>
                <p className="text-sm text-gray-600">Sube tu mejor foto</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nombre completo *</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input ref={nameRef} type="text" placeholder="Tu nombre" className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-amber-400 focus:outline-none transition-colors" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input ref={emailRef} type="email" placeholder="tu@email.com" className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-amber-400 focus:outline-none transition-colors" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Contraseña *</label>
                <input ref={passwordRef} type="password" placeholder="Mínimo 6 caracteres" className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-amber-400 focus:outline-none transition-colors" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Edad *</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input ref={ageRef} type="number" min="18" max="99" placeholder="18" className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-amber-400 focus:outline-none transition-colors" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Género *</label>
                  <select ref={genderRef} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-amber-400 focus:outline-none transition-colors">
                    <option value="">Seleccionar</option>
                    <option value="mujer">Mujer</option>
                    <option value="hombre">Hombre</option>
                    <option value="otro">Otro</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                <textarea ref={bioRef} placeholder="Cuéntanos sobre ti..." rows="3" className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-amber-400 focus:outline-none transition-colors resize-none"></textarea>
              </div>
              <button onClick={handleRegister} className="w-full bg-gradient-to-r from-amber-400 to-orange-500 text-white py-4 rounded-full font-bold text-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 mt-6">
                Registrarse
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentView === 'login') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <button onClick={() => setCurrentView('welcome')} className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6">
            <ArrowLeft className="w-5 h-5" />
            Volver
          </button>
          <div className="bg-white rounded-3xl shadow-xl p-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Iniciar Sesión</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input ref={emailRef} type="email" placeholder="tu@email.com" className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-amber-400 focus:outline-none transition-colors" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Contraseña</label>
                <input ref={passwordRef} type="password" placeholder="Tu contraseña" className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-amber-400 focus:outline-none transition-colors" />
              </div>
              <button onClick={handleLogin} className="w-full bg-gradient-to-r from-amber-400 to-orange-500 text-white py-4 rounded-full font-bold text-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 mt-6">
                Entrar
              </button>
              <p className="text-center text-gray-600 text-sm mt-4">
                ¿No tienes cuenta?{' '}
                <button onClick={() => setCurrentView('register')} className="text-amber-600 font-medium hover:text-amber-700">
                  Regístrate
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const availableProfiles = getAvailableProfiles();
  const currentProfile = availableProfiles[currentProfileIndex];

  if (currentView === 'discover') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
        <VideoCallScreen />
        <InterstitialAd />
        <PremiumModal />
        <MatchModal />
        <div className="max-w-2xl mx-auto px-4 py-6 pb-24">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
              <Heart className="w-8 h-8 text-red-500" fill="currentColor" />
              CanLove
            </h1>
            <div className="flex items-center gap-3">
              {isPremium && (
                <div className="bg-gradient-to-r from-amber-400 to-orange-500 px-4 py-2 rounded-full flex items-center gap-2 shadow-lg">
                  <Crown className="w-5 h-5 text-white" />
                  <span className="text-white font-bold text-sm">Premium</span>
                </div>
              )}
              <button onClick={openPremiumScreen} className="p-2 hover:bg-amber-100 rounded-full transition-colors">
                <Crown className="w-6 h-6 text-amber-600" />
              </button>
            </div>
          </div>
          {!isPremium && (
            <div className="bg-amber-100 border border-amber-300 rounded-xl p-3 mb-4">
              <p className="text-sm text-amber-800 text-center">
                <span className="font-bold">{dailyLikesCount}/10</span> likes usados hoy • {' '}
                <button onClick={openPremiumScreen} className="underline font-medium hover:text-amber-900">
                  Obtén ilimitados con Premium
                </button>
              </p>
            </div>
          )}
          <AdBanner />
          {availableProfiles.length === 0 ? (
            <div className="bg-white rounded-3xl shadow-xl p-12 text-center">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <User className="w-12 h-12 text-gray-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">No hay más perfiles</h2>
              <p className="text-gray-600 mb-6">Has visto todos los perfiles disponibles. Vuelve más tarde para ver nuevos usuarios.</p>
            </div>
          ) : currentProfile ? (
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
              <div className="relative">
                <img src={currentProfile.photo} alt={currentProfile.name} className="w-full h-96 object-cover" />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6">
                  <h2 className="text-3xl font-bold text-white mb-1">
                    {currentProfile.name}, {currentProfile.age}
                  </h2>
                  <p className="text-white opacity-90">{currentProfile.bio}</p>
                </div>
              </div>
              <div className="p-6">
                <div className="flex justify-center gap-6">
                  <button onClick={handlePass} className="w-16 h-16 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 shadow-lg">
                    <X className="w-8 h-8 text-gray-600" />
                  </button>
                  <button onClick={handleLike} className="w-20 h-20 bg-gradient-to-r from-red-400 to-pink-500 hover:from-red-500 hover:to-pink-600 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 shadow-xl">
                    <Heart className="w-10 h-10 text-white" fill="currentColor" />
                  </button>
                  <button onClick={openPremiumScreen} className="w-16 h-16 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 shadow-lg">
                    <Star className="w-8 h-8 text-white" fill="currentColor" />
                  </button>
                </div>
              </div>
            </div>
          ) : null}
        </div>
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
          <div className="max-w-2xl mx-auto px-4 py-3">
            <div className="flex justify-around">
              <button onClick={() => setCurrentView('discover')} className="flex flex-col items-center gap-1 text-amber-600">
                <Sparkles className="w-6 h-6" fill="currentColor" />
                <span className="text-xs font-medium">Descubrir</span>
              </button>
              <button onClick={() => setCurrentView('matches')} className="flex flex-col items-center gap-1 text-gray-600 hover:text-amber-600 transition-colors relative">
                <MessageCircle className="w-6 h-6" />
                {getTotalUnread() > 0 && (
                  <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {getTotalUnread()}
                  </div>
                )}
                <span className="text-xs font-medium">Chats</span>
              </button>
              <button onClick={() => setCurrentView('profile')} className="flex flex-col items-center gap-1 text-gray-600 hover:text-amber-600 transition-colors">
                <User className="w-6 h-6" />
                <span className="text-xs font-medium">Perfil</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentView === 'matches') {
    const myMatches = users.filter(u => matches.includes(u.id));
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 pb-24">
        <VideoCallScreen />
        <div className="max-w-2xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Tus Matches</h1>
          <AdBanner />
          {myMatches.length === 0 ? (
            <div className="bg-white rounded-3xl shadow-xl p-12 text-center">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <MessageCircle className="w-12 h-12 text-gray-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">No tienes matches aún</h2>
              <p className="text-gray-600 mb-6">Empieza a dar likes para conseguir tu primer match</p>
              <button onClick={() => setCurrentView('discover')} className="bg-gradient-to-r from-amber-400 to-orange-500 text-white px-8 py-3 rounded-full font-bold hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                Descubrir Personas
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {myMatches.map(match => (
                <div key={match.id} onClick={() => openChat(match)} className="bg-white rounded-2xl p-4 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <img src={match.photo} alt={match.name} className="w-16 h-16 rounded-full object-cover border-2 border-amber-400" />
                      <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-800 text-lg">{match.name}</h3>
                      <p className="text-gray-600 text-sm truncate">{getLastMessage(match.id)}</p>
                    </div>
                    {unreadCounts[match.id] && (
                      <div className="bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">
                        {unreadCounts[match.id]}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
          <div className="max-w-2xl mx-auto px-4 py-3">
            <div className="flex justify-around">
              <button onClick={() => setCurrentView('discover')} className="flex flex-col items-center gap-1 text-gray-600 hover:text-amber-600 transition-colors">
                <Sparkles className="w-6 h-6" />
                <span className="text-xs font-medium">Descubrir</span>
              </button>
              <button onClick={() => setCurrentView('matches')} className="flex flex-col items-center gap-1 text-amber-600">
                <MessageCircle className="w-6 h-6" fill="currentColor" />
                <span className="text-xs font-medium">Chats</span>
              </button>
              <button onClick={() => setCurrentView('profile')} className="flex flex-col items-center gap-1 text-gray-600 hover:text-amber-600 transition-colors">
                <User className="w-6 h-6" />
                <span className="text-xs font-medium">Perfil</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentView === 'chat' && selectedChat) {
    const chatMessages = conversations[selectedChat.id] || [];
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex flex-col">
        <VideoCallScreen />
        <div className="bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-2xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button onClick={() => { setSelectedChat(null); setCurrentView('matches'); }} className="text-gray-600 hover:text-gray-800">
                  <ArrowLeft className="w-6 h-6" />
                </button>
                <img src={selectedChat.photo} alt={selectedChat.name} className="w-12 h-12 rounded-full object-cover border-2 border-amber-400" />
                <div>
                  <h2 className="font-bold text-gray-800 text-lg">{selectedChat.name}</h2>
                  <p className="text-xs text-green-500">En línea</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={startAudioCall} className="p-2 hover:bg-amber-100 rounded-full transition-colors">
                  <Phone className="w-6 h-6 text-amber-600" />
                </button>
                <button onClick={startVideoCall} className="p-2 hover:bg-amber-100 rounded-full transition-colors">
                  <Video className="w-6 h-6 text-amber-600" />
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3 max-w-2xl mx-auto w-full">
          {chatMessages.length === 0 ? (
            <div className="text-center text-gray-500 py-12">
              <MessageCircle className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium">¡Empiecen a chatear!</p>
              <p className="text-sm">Díganle hola a {selectedChat.name}</p>
            </div>
          ) : (
            chatMessages.map(msg => (
              <div key={msg.id} className={`flex ${msg.senderId === currentUser.id ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl shadow-sm ${msg.senderId === currentUser.id ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-white' : 'bg-white text-gray-800'}`}>
                  <p>{msg.text}</p>
                  <p className={`text-xs mt-1 ${msg.senderId === currentUser.id ? 'text-white opacity-75' : 'text-gray-500'}`}>
                    {formatTime(msg.timestamp)}
                  </p>
                </div>
              </div>
            ))
          )}
          <div ref={chatEndRef} />
        </div>
        <div className="bg-white border-t border-gray-200 p-4">
          <div className="max-w-2xl mx-auto flex gap-3">
            <input ref={messageInputRef} type="text" placeholder="Escribe un mensaje..." onKeyPress={(e) => e.key === 'Enter' && sendMessage()} className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-full focus:border-amber-400 focus:outline-none transition-colors" />
            <button onClick={sendMessage} className="bg-gradient-to-r from-amber-400 to-orange-500 text-white p-3 rounded-full hover:shadow-lg transition-all duration-300 transform hover:scale-105">
              <Send className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (currentView === 'profile') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 pb-24">
        <div className="max-w-2xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Mi Perfil</h1>
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-6">
            <div className="relative h-48 bg-gradient-to-r from-amber-400 to-orange-500">
              <img src={currentUser.photo} alt={currentUser.name} className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-32 h-32 rounded-full object-cover border-4 border-white shadow-xl" />
            </div>
            <div className="pt-20 pb-6 px-6 text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-1">{currentUser.name}, {currentUser.age}</h2>
              <p className="text-gray-600 mb-4">{currentUser.email}</p>
              {currentUser.bio && (
                <p className="text-gray-700 mb-4 italic">"{currentUser.bio}"</p>
              )}
              {isPremium && (
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-400 to-orange-500 px-4 py-2 rounded-full mb-4">
                  <Crown className="w-5 h-5 text-white" />
                  <span className="text-white font-bold">Miembro Premium</span>
                </div>
              )}
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <h3 className="font-bold text-gray-800 text-lg mb-4">Estadísticas</h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-amber-50 rounded-xl p-4">
                <p className="text-3xl font-bold text-amber-600">{likes.length}</p>
                <p className="text-sm text-gray-600">Likes dados</p>
              </div>
              <div className="bg-orange-50 rounded-xl p-4">
                <p className="text-3xl font-bold text-orange-600">{matches.length}</p>
                <p className="text-sm text-gray-600">Matches</p>
              </div>
              <div className="bg-red-50 rounded-xl p-4">
                <p className="text-3xl font-bold text-red-600">{passes.length}</p>
                <p className="text-sm text-gray-600">Passes</p>
              </div>
            </div>
          </div>
          {!isPremium && (
            <div className="bg-gradient-to-r from-amber-400 to-orange-500 rounded-2xl shadow-lg p-6 mb-6 text-white">
              <div className="flex items-center gap-3 mb-4">
                <Crown className="w-8 h-8" />
                <h3 className="font-bold text-xl">Hazte Premium</h3>
              </div>
              <p className="mb-4 opacity-90">Desbloquea likes ilimitados, sin anuncios y más funciones exclusivas</p>
              <button onClick={openPremiumScreen} className="bg-white text-amber-600 px-6 py-3 rounded-full font-bold hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                Ver Planes
              </button>
            </div>
          )}
          <button onClick={handleLogout} className="w-full bg-red-500 text-white py-4 rounded-full font-bold hover:bg-red-600 transition-colors shadow-lg">
            Cerrar Sesión
          </button>
        </div>
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
          <div className="max-w-2xl mx-auto px-4 py-3">
            <div className="flex justify-around">
              <button onClick={() => setCurrentView('discover')} className="flex flex-col items-center gap-1 text-gray-600 hover:text-amber-600 transition-colors">
                <Sparkles className="w-6 h-6" />
                <span className="text-xs font-medium">Descubrir</span>
              </button>
              <button onClick={() => setCurrentView('matches')} className="flex flex-col items-center gap-1 text-gray-600 hover:text-amber-600 transition-colors relative">
                <MessageCircle className="w-6 h-6" />
                {getTotalUnread() > 0 && (
                  <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {getTotalUnread()}
                  </div>
                )}
                <span className="text-xs font-medium">Chats</span>
              </button>
              <button onClick={() => setCurrentView('profile')} className="flex flex-col items-center gap-1 text-amber-600">
                <User className="w-6 h-6" fill="currentColor" />
                <span className="text-xs font-medium">Perfil</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}