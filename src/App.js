import React, { useState, useEffect, useRef } from 'react';
import { Heart, User, Mail, Calendar, Image, LogIn, UserPlus, Home, Sparkles, MessageCircle, X, Send, ArrowLeft, Video, Phone, Mic, MicOff, VideoOff, PhoneOff, Crown, Check, Star } from 'lucide-react';
import AgoraRTC from 'agora-rtc-sdk-ng';
import { AGORA_APP_ID } from './AgoraConfig';
import { db } from './firebase';
import { collection, addDoc, getDocs, query, where, updateDoc, doc, getDoc, onSnapshot } from 'firebase/firestore';

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
  { name: 'Fernando Díaz', age: '31', gender: 'hombre', bio: 'Arquitecto. Construyo sueños, uno a la vez 🗿', photo: 'https://i.pravatar.cc/300?img=51' }
];


// Componente de Términos y Condiciones como página separada
const TermsPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full p-2 shadow-lg">
        <img src="/logo.png" alt="CanLove Logo" className="w-full h-full object-contain" />
        </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">CanLove</h1>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Términos y Condiciones</h2>
          
          <div className="prose prose-amber max-w-none">
            <h3 className="text-xl font-bold text-gray-800 mb-3">1. Aceptación de Términos</h3>
            <p className="text-gray-600 mb-4">
              Al acceder y usar CanLove, aceptas estar sujeto a estos Términos y Condiciones. Si no estás de acuerdo con alguna parte de estos términos, no debes usar nuestra aplicación.
            </p>

            <h3 className="text-xl font-bold text-gray-800 mb-3">2. Requisitos de Edad</h3>
            <p className="text-gray-600 mb-4">
              Debes tener al menos 18 años de edad para usar CanLove. Al crear una cuenta, confirmas que tienes la edad legal requerida.
            </p>

            <h3 className="text-xl font-bold text-gray-800 mb-3">3. Cuenta de Usuario</h3>
            <p className="text-gray-600 mb-4">
              Eres responsable de mantener la confidencialidad de tu cuenta y contraseña. Aceptas la responsabilidad de todas las actividades que ocurran bajo tu cuenta.
            </p>

            <h3 className="text-xl font-bold text-gray-800 mb-3">4. Conducta del Usuario</h3>
            <p className="text-gray-600 mb-4">
              Aceptas usar CanLove de manera respetuosa y legal. Está prohibido:
            </p>
            <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
              <li>Acosar, intimidar o amenazar a otros usuarios</li>
              <li>Publicar contenido ofensivo, difamatorio o ilegal</li>
              <li>Hacerse pasar por otra persona</li>
              <li>Usar la aplicación con fines comerciales sin autorización</li>
              <li>Intentar acceder a cuentas de otros usuarios</li>
            </ul>

            <h3 className="text-xl font-bold text-gray-800 mb-3">5. Contenido del Usuario</h3>
            <p className="text-gray-600 mb-4">
              Conservas todos los derechos sobre el contenido que publicas en CanLove. Sin embargo, nos otorgas una licencia para usar, mostrar y distribuir tu contenido dentro de la aplicación.
            </p>

            <h3 className="text-xl font-bold text-gray-800 mb-3">6. Suscripción Premium</h3>
            <p className="text-gray-600 mb-4">
              La suscripción Premium se renueva automáticamente cada mes. Puedes cancelar en cualquier momento, pero no se realizarán reembolsos por períodos parciales.
            </p>

            <h3 className="text-xl font-bold text-gray-800 mb-3">7. Privacidad y Seguridad</h3>
            <p className="text-gray-600 mb-4">
              Tu privacidad es importante para nosotros. Consulta nuestra Política de Privacidad para entender cómo recopilamos, usamos y protegemos tu información personal.
            </p>

            <h3 className="text-xl font-bold text-gray-800 mb-3">8. Terminación</h3>
            <p className="text-gray-600 mb-4">
              Nos reservamos el derecho de suspender o terminar tu cuenta si violas estos términos o por cualquier otra razón que consideremos apropiada.
            </p>

            <h3 className="text-xl font-bold text-gray-800 mb-3">9. Limitación de Responsabilidad</h3>
            <p className="text-gray-600 mb-4">
              CanLove se proporciona "tal cual". No garantizamos que el servicio será ininterrumpido o libre de errores. No somos responsables de las interacciones entre usuarios.
            </p>

            <h3 className="text-xl font-bold text-gray-800 mb-3">10. Cambios a los Términos</h3>
            <p className="text-gray-600 mb-4">
              Podemos modificar estos términos en cualquier momento. Te notificaremos sobre cambios significativos. El uso continuado de la aplicación después de los cambios constituye tu aceptación.
            </p>

            <h3 className="text-xl font-bold text-gray-800 mb-3">11. Contacto</h3>
            <p className="text-gray-600 mb-4">
              Si tienes preguntas sobre estos Términos y Condiciones, contáctanos a través de soporte@canlove.com
            </p>

            <p className="text-sm text-gray-500 mt-6">
              Última actualización: {new Date().toLocaleDateString('es-ES')}
            </p>
          </div>
          
          <a href="/" className="block w-full bg-gradient-to-r from-amber-400 to-orange-500 text-white py-3 rounded-full font-bold mt-6 hover:shadow-xl transition-all text-center">
            Volver a CanLove
          </a>
        </div>
      </div>
    </div>
  );
};

const PrivacyPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full p-2 shadow-lg">
          <img src="/logo.png" alt="CanLove Logo" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">CanLove</h1>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Política de Privacidad</h2>
          
          <div className="prose prose-amber max-w-none">
            <p className="text-sm text-gray-500 mb-6">
              <strong>Fecha de entrada en vigor:</strong> {new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
              <p className="text-sm text-blue-800">
                <strong>Resumen:</strong> CanLove respeta tu privacidad. Recopilamos información necesaria para conectarte con otras personas. Usamos publicidad de Google AdSense. Nunca vendemos tus datos personales.
              </p>
            </div>

            <h3 className="text-xl font-bold text-gray-800 mb-3 mt-6">1. Información que Recopilamos</h3>
            
            <h4 className="text-lg font-semibold text-gray-700 mb-2">1.1 Información que nos proporcionas directamente:</h4>
            <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2 ml-4">
              <li><strong>Información de registro:</strong> nombre, correo electrónico, contraseña, fecha de nacimiento, género</li>
              <li><strong>Información de perfil:</strong> fotografías, biografía, preferencias de búsqueda</li>
              <li><strong>Contenido del usuario:</strong> mensajes, likes, matches</li>
              <li><strong>Información de pago:</strong> datos de tarjeta (procesados por terceros seguros)</li>
            </ul>

            <h4 className="text-lg font-semibold text-gray-700 mb-2">1.2 Información recopilada automáticamente:</h4>
            <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2 ml-4">
              <li><strong>Información del dispositivo:</strong> modelo, sistema operativo, identificadores únicos, configuración del dispositivo</li>
              <li><strong>Datos de uso:</strong> funciones utilizadas, tiempo de uso, clics, páginas visitadas</li>
              <li><strong>Información de ubicación:</strong> ubicación aproximada basada en dirección IP</li>
              <li><strong>Cookies y tecnologías similares:</strong> identificadores de sesión, preferencias</li>
            </ul>

            <h3 className="text-xl font-bold text-gray-800 mb-3 mt-6">2. Cómo Utilizamos tu Información</h3>
            <p className="text-gray-600 mb-2">Utilizamos tu información para:</p>
            <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2 ml-4">
              <li>Crear y gestionar tu cuenta</li>
              <li>Facilitar matches y conexiones entre usuarios</li>
              <li>Procesar transacciones y suscripciones Premium</li>
              <li>Personalizar tu experiencia y recomendaciones</li>
              <li>Enviar notificaciones sobre matches, mensajes y actualizaciones</li>
              <li>Mejorar nuestros servicios mediante análisis y pruebas</li>
              <li>Prevenir fraudes, spam y actividades ilegales</li>
              <li>Cumplir con obligaciones legales</li>
              <li>Mostrar publicidad relevante y medir su efectividad</li>
            </ul>

            <h3 className="text-xl font-bold text-gray-800 mb-3 mt-6">3. Publicidad y Google AdSense</h3>
            <div className="bg-amber-50 border border-amber-300 rounded-lg p-4 mb-4">
              <h4 className="text-lg font-semibold text-gray-800 mb-2">3.1 Uso de Google AdSense</h4>
              <p className="text-gray-600 mb-3">
                CanLove utiliza Google AdSense para mostrar anuncios. Google utiliza cookies y tecnologías similares para:
              </p>
              <ul className="list-disc list-inside text-gray-600 mb-3 space-y-2 ml-4">
                <li>Mostrar anuncios personalizados basados en tus visitas anteriores a nuestro sitio y otros sitios en Internet</li>
                <li>Medir la efectividad de los anuncios</li>
                <li>Prevenir el fraude publicitario</li>
              </ul>
              
              <h4 className="text-lg font-semibold text-gray-800 mb-2">3.2 Cookies de Terceros</h4>
              <p className="text-gray-600 mb-3">
                Los proveedores externos, incluido Google, utilizan cookies para publicar anuncios basados en las visitas anteriores de un usuario a tu sitio web u otros sitios web. El uso de cookies publicitarias permite a Google y a sus socios publicar anuncios basándose en las visitas de los usuarios a nuestro sitio y/o a otros sitios de Internet.
              </p>

              <h4 className="text-lg font-semibold text-gray-800 mb-2">3.3 Control de Anuncios Personalizados</h4>
              <p className="text-gray-600 mb-2">
                Puedes inhabilitar el uso de cookies por parte de Google visitando:
              </p>
              <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline block mb-2">
                https://www.google.com/settings/ads
              </a>
              <p className="text-gray-600">
                También puedes visitar <a href="http://www.aboutads.info" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">aboutads.info</a> para inhabilitar las cookies de otros proveedores.
              </p>
            </div>

            <h3 className="text-xl font-bold text-gray-800 mb-3 mt-6">4. Compartir Información</h3>
            
            <h4 className="text-lg font-semibold text-gray-700 mb-2">4.1 Con otros usuarios:</h4>
            <p className="text-gray-600 mb-3">
              Tu perfil (nombre, edad, fotografías, biografía) es visible para otros usuarios de CanLove. Tú controlas qué información incluyes en tu perfil.
            </p>

            <h4 className="text-lg font-semibold text-gray-700 mb-2">4.2 Con proveedores de servicios:</h4>
            <p className="text-gray-600 mb-2">Compartimos información con:</p>
            <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2 ml-4">
              <li><strong>Procesadores de pago:</strong> para procesar transacciones (no almacenamos datos completos de tarjetas)</li>
              <li><strong>Servicios de hosting y almacenamiento:</strong> para almacenar datos de forma segura</li>
              <li><strong>Servicios de análisis:</strong> para entender cómo se usa la aplicación</li>
              <li><strong>Proveedores de publicidad:</strong> Google AdSense y sus socios</li>
            </ul>

            <h4 className="text-lg font-semibold text-gray-700 mb-2">4.3 Por motivos legales:</h4>
            <p className="text-gray-600 mb-4">
              Podemos divulgar información si lo requiere la ley, para proteger nuestros derechos, prevenir fraudes o proteger la seguridad de los usuarios.
            </p>

            <p className="text-gray-600 mb-4">
              <strong>NO vendemos, alquilamos ni compartimos tu información personal con terceros para sus fines de marketing.</strong>
            </p>

            <h3 className="text-xl font-bold text-gray-800 mb-3 mt-6">5. Cookies y Tecnologías de Seguimiento</h3>
            <p className="text-gray-600 mb-3">
              Utilizamos las siguientes cookies:
            </p>
            <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2 ml-4">
              <li><strong>Cookies esenciales:</strong> necesarias para el funcionamiento del sitio</li>
              <li><strong>Cookies de rendimiento:</strong> para analizar el uso y mejorar servicios</li>
              <li><strong>Cookies de funcionalidad:</strong> para recordar tus preferencias</li>
              <li><strong>Cookies de publicidad:</strong> Google AdSense y socios para anuncios personalizados</li>
            </ul>
            <p className="text-gray-600 mb-4">
              Puedes controlar las cookies desde la configuración de tu navegador. Ten en cuenta que deshabilitar ciertas cookies puede afectar la funcionalidad del sitio.
            </p>

            <h3 className="text-xl font-bold text-gray-800 mb-3 mt-6">6. Seguridad de los Datos</h3>
            <p className="text-gray-600 mb-4">
              Implementamos medidas de seguridad técnicas, administrativas y físicas para proteger tu información:
            </p>
            <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2 ml-4">
              <li>Encriptación de datos sensibles (HTTPS/SSL)</li>
              <li>Contraseñas encriptadas con algoritmos seguros</li>
              <li>Acceso limitado a información personal solo para personal autorizado</li>
              <li>Auditorías de seguridad regulares</li>
              <li>Protección contra ataques DDoS y malware</li>
            </ul>
            <p className="text-gray-600 mb-4">
              Sin embargo, ningún sistema es 100% seguro. Te recomendamos usar contraseñas fuertes y no compartirlas.
            </p>

            <h3 className="text-xl font-bold text-gray-800 mb-3 mt-6">7. Retención de Datos</h3>
            <p className="text-gray-600 mb-4">
              Conservamos tu información mientras tu cuenta esté activa o mientras sea necesario para proporcionar servicios. Puedes solicitar la eliminación de tu cuenta en cualquier momento. Después de eliminar tu cuenta:
            </p>
            <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2 ml-4">
              <li>Tu perfil dejará de ser visible inmediatamente</li>
              <li>Eliminaremos tus datos personales dentro de 30 días</li>
              <li>Podemos conservar cierta información por obligaciones legales o para resolver disputas</li>
            </ul>

            <h3 className="text-xl font-bold text-gray-800 mb-3 mt-6">8. Tus Derechos y Opciones</h3>
            <p className="text-gray-600 mb-2">Dependiendo de tu ubicación, puedes tener los siguientes derechos:</p>
            <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2 ml-4">
              <li><strong>Acceso:</strong> solicitar una copia de tu información personal</li>
              <li><strong>Rectificación:</strong> corregir información inexacta o incompleta</li>
              <li><strong>Eliminación:</strong> solicitar la eliminación de tu cuenta y datos ("derecho al olvido")</li>
              <li><strong>Portabilidad:</strong> recibir tus datos en formato estructurado</li>
              <li><strong>Oposición:</strong> oponerte al procesamiento de tus datos</li>
              <li><strong>Restricción:</strong> limitar cómo usamos tu información</li>
              <li><strong>Retirar consentimiento:</strong> donde el procesamiento se base en consentimiento</li>
            </ul>
            <p className="text-gray-600 mb-4">
              Para ejercer estos derechos, contáctanos en <strong>privacidad@canlove.com</strong>
            </p>

            <h3 className="text-xl font-bold text-gray-800 mb-3 mt-6">9. Privacidad de Menores</h3>
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
              <p className="text-gray-700 font-semibold mb-2">
                CanLove está destinado EXCLUSIVAMENTE a personas mayores de 18 años.
              </p>
              <p className="text-gray-600">
                No recopilamos intencionalmente información de menores de 18 años. Si descubrimos que hemos recopilado información de un menor, eliminaremos inmediatamente esa cuenta y todos los datos asociados. Si crees que tenemos información de un menor, contáctanos inmediatamente.
              </p>
            </div>

            <h3 className="text-xl font-bold text-gray-800 mb-3 mt-6">10. Transferencias Internacionales</h3>
            <p className="text-gray-600 mb-4">
              Tu información puede ser transferida y almacenada en servidores ubicados fuera de tu país de residencia, donde las leyes de protección de datos pueden ser diferentes. Al usar CanLove, consientes estas transferencias. Implementamos salvaguardias adecuadas para proteger tu información, incluyendo cláusulas contractuales estándar aprobadas.
            </p>

            <h3 className="text-xl font-bold text-gray-800 mb-3 mt-6">11. Derechos Específicos por Región</h3>
            
            <h4 className="text-lg font-semibold text-gray-700 mb-2">11.1 Para residentes de la Unión Europea (GDPR):</h4>
            <p className="text-gray-600 mb-3">
              Tienes derecho a presentar una queja ante tu autoridad de protección de datos local. Nuestro representante en la UE puede ser contactado en: <strong>gdpr@canlove.com</strong>
            </p>

            <h4 className="text-lg font-semibold text-gray-700 mb-2">11.2 Para residentes de California (CCPA):</h4>
            <p className="text-gray-600 mb-3">
              Tienes derecho a saber qué información recopilamos, eliminarla y optar por no venderla (aunque no vendemos información personal). Para ejercer estos derechos, contáctanos en <strong>california@canlove.com</strong>
            </p>

            <h4 className="text-lg font-semibold text-gray-700 mb-2">11.3 Para residentes de Brasil (LGPD):</h4>
            <p className="text-gray-600 mb-4">
              Tienes derechos similares al GDPR. Contáctanos en <strong>lgpd@canlove.com</strong>
            </p>

            <h3 className="text-xl font-bold text-gray-800 mb-3 mt-6">12. Enlaces a Terceros</h3>
            <p className="text-gray-600 mb-4">
              CanLove puede contener enlaces a sitios web de terceros (incluidos anuncios de Google). No somos responsables de las prácticas de privacidad de estos sitios. Te recomendamos leer sus políticas de privacidad.
            </p>

            <h3 className="text-xl font-bold text-gray-800 mb-3 mt-6">13. Cambios a esta Política</h3>
            <p className="text-gray-600 mb-4">
              Podemos actualizar esta Política de Privacidad ocasionalmente para reflejar cambios en nuestras prácticas o por otros motivos operativos, legales o regulatorios. Te notificaremos sobre cambios materiales mediante:
            </p>
            <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2 ml-4">
              <li>Un aviso destacado en la aplicación</li>
              <li>Correo electrónico (si has proporcionado tu dirección)</li>
              <li>Actualización de la fecha de "entrada en vigor" arriba</li>
            </ul>
            <p className="text-gray-600 mb-4">
              Tu uso continuado de CanLove después de los cambios constituye tu aceptación de la política actualizada.
            </p>

            <h3 className="text-xl font-bold text-gray-800 mb-3 mt-6">14. Contacto</h3>
            <p className="text-gray-600 mb-3">
              Si tienes preguntas, inquietudes o solicitudes sobre esta Política de Privacidad o nuestras prácticas de datos, contáctanos:
            </p>
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <p className="text-gray-700 mb-2"><strong>CanLove</strong></p>
              <p className="text-gray-600 mb-1"><strong>Email:</strong> privcanlove@gmail.com</p>
              <p className="text-gray-600 mb-1"><strong>Soporte:</strong> soportecanlove@gmail.com</p>
              <p className="text-gray-600 mb-1"><strong>Dirección:</strong> Cra63c 96a -220</p>
              <p className="text-gray-600"><strong>Teléfono:</strong> 3113684574</p>
            </div>

            <div className="bg-green-50 border-l-4 border-green-500 p-4 mt-6">
              <p className="text-sm text-green-800">
                <strong>✓ Cumplimiento:</strong> Esta Política de Privacidad cumple con GDPR (UE), CCPA (California), LGPD (Brasil), COPPA y requisitos de Google AdSense.
              </p>
            </div>

            <p className="text-center text-sm text-gray-500 mt-8 pt-6 border-t border-gray-200">
              © {new Date().getFullYear()} CanLove. Todos los derechos reservados.
            </p>
          </div>
          
          <a href="/" className="block w-full bg-gradient-to-r from-amber-400 to-orange-500 text-white py-3 rounded-full font-bold mt-6 hover:shadow-xl transition-all text-center">
            Volver a CanLove
          </a>
        </div>
      </div>
    </div>
  );
};

// Componente principal de la app
function CanLoveApp() {
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
  const [currentCall, setCurrentCall] = useState(null);
  const [realtimeUnsubscribe, setRealtimeUnsubscribe] = useState(null);

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

const loadUsersFromFirebase = async () => {
  try {
    const usersRef = collection(db, 'users');
    const querySnapshot = await getDocs(usersRef);
    
    const allUsers = [];
    querySnapshot.forEach((doc) => {
      allUsers.push({ id: doc.id, ...doc.data() });
    });
    
    setUsers(allUsers);
  } catch (error) {
    console.error('Error cargando usuarios:', error);
  }
};

  const loadData = async () => {
  try {
    // Cargar usuarios desde Firebase
    await loadUsersFromFirebase();
    
    // Verificar si hay sesión guardada
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

const getAvailableProfiles = () => {
  return users.filter(u => u.id !== currentUser?.id && !likes.includes(u.id) && !passes.includes(u.id));
};

const loadUserInteractions = async (userId) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      const userData = userDoc.data();
      setLikes(userData.likes || []);
      setPasses(userData.passes || []);
      setMatches(userData.matches || []);
    }
    
    const currentCount = parseInt(localStorage.getItem(`canlove_daily_likes_${userId}`) || '0');
    setDailyLikesCount(currentCount);
  } catch (error) {
    console.error('Error cargando interacciones:', error);
  }
};
  const loadConversations = async (userId) => {
  try {
    const messagesRef = collection(db, 'messages');
    const q1 = query(messagesRef, where('senderId', '==', userId));
    const q2 = query(messagesRef, where('receiverId', '==', userId));
    
    const [sentSnapshot, receivedSnapshot] = await Promise.all([
      getDocs(q1),
      getDocs(q2)
    ]);
    
    const allMessages = [];
    sentSnapshot.forEach(doc => allMessages.push({ id: doc.id, ...doc.data() }));
    receivedSnapshot.forEach(doc => allMessages.push({ id: doc.id, ...doc.data() }));
    
    // Organizar por conversación
    const convos = {};
    allMessages.forEach(msg => {
      const otherUserId = msg.senderId === userId ? msg.receiverId : msg.senderId;
      if (!convos[otherUserId]) convos[otherUserId] = [];
      convos[otherUserId].push(msg);
    });
    
    // Ordenar mensajes por timestamp
    Object.keys(convos).forEach(key => {
      convos[key].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    });
    
    setConversations(convos);
    
    // Calcular no leídos
    const unread = {};
    Object.keys(convos).forEach(matchId => {
      const unreadCount = convos[matchId].filter(msg => !msg.read && msg.receiverId === userId).length;
      if (unreadCount > 0) unread[matchId] = unreadCount;
    });
    setUnreadCounts(unread);
  } catch (error) {
    console.error('Error cargando conversaciones:', error);
  }
};


const setupRealtimeListeners = (userId) => {
  if (realtimeUnsubscribe) {
    realtimeUnsubscribe();
  }
  
  const userRef = doc(db, 'users', userId);
  const unsubscribeUser = onSnapshot(userRef, (docSnapshot) => {
    if (docSnapshot.exists()) {
      const userData = docSnapshot.data();
      setLikes(userData.likes || []);
      setMatches(userData.matches || []);
      setPasses(userData.passes || []);
    }
  });

  const messagesRef = collection(db, 'messages');
  const unsubscribeMessages = onSnapshot(
    messagesRef,
    (snapshot) => {
      updateConversationsFromSnapshot(snapshot, userId); // ✅ Llama a la función
    }
  );

  const cleanup = () => {
    unsubscribeUser();
    unsubscribeMessages();
  };
  
  setRealtimeUnsubscribe(() => cleanup);
  return cleanup;
};


const updateConversationsFromSnapshot = (snapshot, userId) => {
  const allMessages = [];
  
  snapshot.forEach((doc) => {
    const data = doc.data();
    if (data.senderId === userId || data.receiverId === userId) {
      allMessages.push({ id: doc.id, ...data });
    }
  });
  
  // Organizar por conversación
  const convos = {};
  allMessages.forEach(msg => {
    const otherUserId = msg.senderId === userId ? msg.receiverId : msg.senderId;
    if (!convos[otherUserId]) convos[otherUserId] = [];
    convos[otherUserId].push(msg);
  });
  
  // Ordenar mensajes por timestamp
  Object.keys(convos).forEach(key => {
    convos[key].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  });
  
  setConversations(convos);  // ✅ BIEN - uso directo
  
  // Calcular no leídos
  const unread = {};
  Object.keys(convos).forEach(matchId => {
    const unreadCount = convos[matchId].filter(
      msg => !msg.read && msg.receiverId === userId
    ).length;
    if (unreadCount > 0) unread[matchId] = unreadCount;
  });
  setUnreadCounts(unread);
};

  const saveUserInteractions = async (userId, newLikes, newPasses, newMatches) => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      likes: newLikes,
      passes: newPasses,
      matches: newMatches
    });
    
    // También actualizar estado local
    setLikes(newLikes);
    setPasses(newPasses);
    setMatches(newMatches);
  } catch (error) {
    console.error('Error guardando interacciones:', error);
  }
};

// Dentro de tu componente, agrega estos estados
const [agoraClient, setAgoraClient] = useState(null);
const [remoteUsers, setRemoteUsers] = useState([]);

// Inicializar Agora cuando el usuario haga login
const initializeAgora = async () => {
  const client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
  
  client.on('user-published', async (user, mediaType) => {
    await client.subscribe(user, mediaType);
    
    if (mediaType === 'video') {
      setRemoteUsers(prev => [...prev, user]);
    }
    
    if (mediaType === 'audio') {
      user.audioTrack.play();
    }
  });
  
  client.on('user-unpublished', (user) => {
    setRemoteUsers(prev => prev.filter(u => u.uid !== user.uid));
  });
  
  setAgoraClient(client);
};

// Llamar esta función en saveCurrentUser después de setCurrentUser
useEffect(() => {
  if (currentUser && !agoraClient) {
    initializeAgora();
  }
  
  // Cleanup al cerrar sesión
  return () => {
    if (agoraClient) {
      agoraClient.leave();
      setAgoraClient(null);
    }
  };
}, [currentUser]);

// Nueva función para iniciar videollamada
const startVideoCall = async () => {
  if (!agoraClient || !selectedChat) {
    alert('No se pudo iniciar la llamada');
    return;
  }
  
  try {
    const channelName = [currentUser.id, selectedChat.id].sort().join('-');
    
    // Unirse al canal
    await agoraClient.join(AGORA_APP_ID, channelName, null, currentUser.id);
    
    // Crear tracks locales
    const [audioTrack, videoTrack] = await AgoraRTC.createMicrophoneAndCameraTracks();
    
    setLocalStream({ audioTrack, videoTrack });
    
    // Publicar tracks
    await agoraClient.publish([audioTrack, videoTrack]);
    
    setIsInCall(true);
    setCallPartner(selectedChat);
    
    // Reproducir video local
    videoTrack.play('local-video');
    
  } catch (error) {
    console.error('Error en videollamada:', error);
    alert('Error al iniciar videollamada: ' + error.message);
  }
};

// Nueva función para iniciar llamada de audio
const startAudioCall = async () => {
  if (!agoraClient || !selectedChat) {
    alert('No se pudo iniciar la llamada');
    return;
  }
  
  try {
    const channelName = [currentUser.id, selectedChat.id].sort().join('-');
    
    await agoraClient.join(AGORA_APP_ID, channelName, null, currentUser.id);
    
    const audioTrack = await AgoraRTC.createMicrophoneAudioTrack();
    
    setLocalStream({ audioTrack });
    
    await agoraClient.publish([audioTrack]);
    
    setIsInCall(true);
    setIsVideoOff(true);
    setCallPartner(selectedChat);
    
  } catch (error) {
    console.error('Error en llamada:', error);
    alert('Error al iniciar llamada: ' + error.message);
  }
};

// Nueva función para terminar llamada
const endCall = async () => {
  try {
    if (localStream) {
      if (localStream.audioTrack) {
        localStream.audioTrack.stop();
        localStream.audioTrack.close();
      }
      if (localStream.videoTrack) {
        localStream.videoTrack.stop();
        localStream.videoTrack.close();
      }
    }
    
    if (agoraClient) {
      await agoraClient.leave();
    }
    
    setLocalStream(null);
    setRemoteUsers([]);
    setIsInCall(false);
    setIsMuted(false);
    setIsVideoOff(false);
    setCallPartner(null);
  } catch (error) {
    console.error('Error al terminar llamada:', error);
  }
};

// Toggle mute
const toggleMute = async () => {
  if (localStream && localStream.audioTrack) {
    await localStream.audioTrack.setEnabled(isMuted);
    setIsMuted(!isMuted);
  }
};

// Toggle video
const toggleVideo = async () => {
  if (localStream && localStream.videoTrack) {
    await localStream.videoTrack.setEnabled(isVideoOff);
    setIsVideoOff(!isVideoOff);
  }
};

// Componente de VideoCallScreen actualizado
const VideoCallScreen = () => {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  
  useEffect(() => {
    // Reproducir video local
    if (localStream && localStream.videoTrack && localVideoRef.current && !isVideoOff) {
      localStream.videoTrack.play(localVideoRef.current);
    }
    
    // Reproducir video remoto
    if (remoteUsers.length > 0 && remoteUsers[0].videoTrack && remoteVideoRef.current) {
      remoteUsers[0].videoTrack.play(remoteVideoRef.current);
    }
    
    // Cleanup al desmontar
    return () => {
      if (localStream && localStream.videoTrack) {
        localStream.videoTrack.stop();
      }
    };
  }, [localStream, remoteUsers, isVideoOff]);
  
  if (!isInCall || !callPartner) return null;
  
  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-b from-black to-transparent p-6 text-white">
        <div className="text-center">
          <img src={callPartner.photo} alt={callPartner.name} className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-amber-400 shadow-lg" />
          <h2 className="text-2xl font-bold">{callPartner.name}</h2>
          <p className="text-sm opacity-75">
            {remoteUsers.length > 0 ? 'Conectado' : 'Llamando...'}
          </p>
        </div>
      </div>
      
      {/* Video principal (remoto) */}
      <div className="flex-1 flex items-center justify-center relative bg-gray-900">
        {remoteUsers.length > 0 && !isVideoOff ? (
          <div 
            ref={remoteVideoRef} 
            className="w-full h-full"
            style={{ width: '100%', height: '100%' }}
          />
        ) : (
          <div className="text-center">
            <div className="w-32 h-32 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-16 h-16 text-gray-500" />
            </div>
            <p className="text-white">
              {remoteUsers.length === 0 ? 'Esperando...' : 'Cámara desactivada'}
            </p>
          </div>
        )}
        
        {/* Video local (miniatura) */}
        {!isVideoOff && (
          <div className="absolute top-4 right-4 w-32 h-48 bg-gray-900 rounded-lg overflow-hidden shadow-2xl border-2 border-amber-400">
            <div 
              ref={localVideoRef} 
              className="w-full h-full"
              style={{ width: '100%', height: '100%' }}
            />
          </div>
        )}
      </div>
      
      {/* Controles */}
      <div className="bg-gradient-to-t from-black to-transparent p-8">
        <div className="flex justify-center gap-4">
          <button 
            onClick={toggleMute} 
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 ${isMuted ? 'bg-red-500' : 'bg-gray-700 hover:bg-gray-600'}`}
          >
            {isMuted ? <MicOff className="w-6 h-6 text-white" /> : <Mic className="w-6 h-6 text-white" />}
          </button>
          <button 
            onClick={toggleVideo} 
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 ${isVideoOff ? 'bg-red-500' : 'bg-gray-700 hover:bg-gray-600'}`}
          >
            {isVideoOff ? <VideoOff className="w-6 h-6 text-white" /> : <Video className="w-6 h-6 text-white" />}
          </button>
          <button 
            onClick={endCall} 
            className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-all duration-300 transform hover:scale-110 shadow-xl"
          >
            <PhoneOff className="w-8 h-8 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};
 const saveCurrentUser = async (user) => {
  try {
    localStorage.setItem('canlove_current_user', JSON.stringify(user));
    setCurrentUser(user);
    setIsPremium(user.isPremium || false);
    
    await loadUserInteractions(user.id);
    await loadConversations(user.id);
    setupRealtimeListeners(user.id);
  
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

  const handleRegister = async () => {
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

  try {
    // Verificar si el email ya existe
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('email', '==', email));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      alert('Este email ya está registrado');
      return;
    }

    // Crear nuevo usuario en Firebase
  const newUser = {
  name,
  email,
  password,
  age,
  gender,
  bio,
  photo: photoPreview || DEFAULT_PHOTO,
  createdAt: new Date().toISOString(),
  isPremium: false,
  premiumUntil: null,
  likes: [],        // ⬅️ AGREGAR
  matches: [],      // ⬅️ AGREGAR
  passes: []        // ⬅️ AGREGAR
};

    const docRef = await addDoc(collection(db, 'users'), newUser);
    newUser.id = docRef.id;

    // Guardar en localStorage solo la sesión actual
    localStorage.setItem('canlove_current_user', JSON.stringify(newUser));
    await saveCurrentUser(newUser); 
    setIsPremium(false);
    
    alert(`¡Bienvenido ${newUser.name}!`);
    
    // Limpiar campos
    if (nameRef.current) nameRef.current.value = '';
    if (emailRef.current) emailRef.current.value = '';
    if (passwordRef.current) passwordRef.current.value = '';
    if (ageRef.current) ageRef.current.value = '';
    if (genderRef.current) genderRef.current.value = '';
    if (bioRef.current) bioRef.current.value = '';
    setPhotoPreview('');
    setCurrentView('discover');
    
    // Cargar todos los usuarios
    await loadUsersFromFirebase();
  } catch (error) {
    console.error('Error al registrar:', error);
    alert('Error al crear cuenta. Intenta de nuevo.');
  }
};

  const handleLogin = async () => {
  const email = emailRef.current?.value?.trim() || '';
  const password = passwordRef.current?.value || '';

  if (!email || !password) {
    alert('Por favor completa todos los campos');
    return;
  }

  try {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('email', '==', email), where('password', '==', password));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      alert('Email o contraseña incorrectos');
      return;
    }

    const userDoc = querySnapshot.docs[0];
    const user = { id: userDoc.id, ...userDoc.data() };

    localStorage.setItem('canlove_current_user', JSON.stringify(user));
    setCurrentUser(user);
    setIsPremium(user.isPremium || false);
    await loadUserInteractions(user.id);
    await loadConversations(user.id);
    setupRealtimeListeners(user.id);
    if (emailRef.current) emailRef.current.value = '';
    if (passwordRef.current) passwordRef.current.value = '';
    
    setCurrentView('discover');
    alert(`¡Bienvenido de nuevo ${user.name}!`);
    
    // Cargar todos los usuarios
    await loadUsersFromFirebase();
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    alert('Error al iniciar sesión. Intenta de nuevo.');
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

const handleLike = async () => {
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
  
  try {
    // Obtener likes del otro usuario desde Firebase
    const likedUserRef = doc(db, 'users', likedUser.id);
    const likedUserDoc = await getDoc(likedUserRef);
    const otherUserLikes = likedUserDoc.data()?.likes || [];
    
    // Actualizar likes del usuario actual en Firebase
    const currentUserRef = doc(db, 'users', currentUser.id);
    await updateDoc(currentUserRef, {
      likes: newLikes
    });
    
    // Verificar si hay match
    if (otherUserLikes.includes(currentUser.id)) {
      const newMatches = [...matches, likedUser.id];
      setMatches(newMatches);
      setNewMatch(likedUser);
      setShowMatchModal(true);
      
      // Actualizar matches de ambos usuarios en Firebase
      await updateDoc(currentUserRef, { matches: newMatches });
      await updateDoc(likedUserRef, { 
        matches: [...(likedUserDoc.data()?.matches || []), currentUser.id] 
      });
      
      saveUserInteractions(currentUser.id, newLikes, passes, newMatches);
    } else {
      setLikes(newLikes);
      saveUserInteractions(currentUser.id, newLikes, passes, matches);
    }
  } catch (error) {
    console.error('Error al procesar like:', error);
    alert('Error al dar like. Intenta de nuevo.');
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

  const sendMessage = async () => {
  const text = messageInputRef.current?.value?.trim();
  if (!text || !selectedChat) return;
  
  const message = {
    text,
    senderId: currentUser.id,
    receiverId: selectedChat.id,
    timestamp: new Date().toISOString(),
    read: false
  };
  
  try {
    // Guardar en Firebase
    await addDoc(collection(db, 'messages'), message);
    
    // Actualizar estado local
    const myConvos = { ...conversations };
    if (!myConvos[selectedChat.id]) myConvos[selectedChat.id] = [];
    myConvos[selectedChat.id].push({ ...message, id: Date.now().toString() });
    setConversations(myConvos);
    
    if (messageInputRef.current) {
      messageInputRef.current.value = '';
      messageInputRef.current.focus();
    }
  } catch (error) {
    console.error('Error enviando mensaje:', error);
  }
};

const markAsRead = async (matchId) => {  // ⬅️ Agregar async
  try {
    // Actualizar mensajes en Firebase
    const messagesRef = collection(db, 'messages');
    const q = query(
      messagesRef, 
      where('receiverId', '==', currentUser.id),
      where('senderId', '==', matchId)
    );
    const snapshot = await getDocs(q);
    
    const updatePromises = [];
    snapshot.forEach((docSnapshot) => {
      if (!docSnapshot.data().read) {
        updatePromises.push(
          updateDoc(doc(db, 'messages', docSnapshot.id), { read: true })
        );
      }
    });
    
    await Promise.all(updatePromises);
    
    // Actualizar estado local
    const myConvos = { ...conversations };
    if (myConvos[matchId]) {
      myConvos[matchId] = myConvos[matchId].map(msg => ({
        ...msg,
        read: msg.receiverId === currentUser.id ? true : msg.read
      }));
      setConversations(myConvos);
    }
    
    const newUnread = { ...unreadCounts };
    delete newUnread[matchId];
    setUnreadCounts(newUnread);
  } catch (error) {
    console.error('Error marcando como leído:', error);
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





  const upgradeToPremium = () => {
    const confirmPayment = window.confirm('💳 PAGO SIMULADO\n\nPlan Premium: $9.99/mes\n\n¿Confirmar?');
    if (confirmPayment) {
      const updatedUser = {
        ...currentUser,
        isPremium: true,
        premiumUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      };
      const updatedUsers = users.map(u => u.id === currentUser.id ? updatedUser : u);
  
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
          <div className="w-44 h-44 mx-auto mb-4">
          <img src="/logo.png" alt="CanLove Logo" className="w-full h-full object-contain drop-shadow-2xl" />
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
            Al continuar, aceptas nuestros{' '}
            <a href="#terminos" onClick={(e) => { e.preventDefault(); setCurrentView('terms'); }} className="underline hover:opacity-100 font-medium">
              términos y condiciones
            </a>
            {' '}y{' '}
            <a href="#privacidad" onClick={(e) => { e.preventDefault(); setCurrentView('privacy'); }} className="underline hover:opacity-100 font-medium">
              política de privacidad
            </a>
          </p>
        </div>
      </div>
    );
  }

  if (currentView === 'terms') {
    return <TermsPage />;
  }

  if (currentView === 'privacy') {
    return <PrivacyPage />;
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
          <button onClick={handleLogout} className="w-full bg-red-500 text-white py-4 rounded-full font-bold hover:bg-red-600 transition-colors shadow-lg mb-4">
            Cerrar Sesión
          </button>
          <div className="flex justify-center gap-4 text-sm">
            <button onClick={() => setCurrentView('privacy')} className="text-gray-600 hover:text-amber-600 underline">
              Privacidad
            </button>
            <span className="text-gray-400">•</span>
            <button onClick={() => setCurrentView('terms')} className="text-gray-600 hover:text-amber-600 underline">
              Términos
            </button>
          </div>
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

export default CanLoveApp;