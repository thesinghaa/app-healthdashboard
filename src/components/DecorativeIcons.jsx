export default function DecorativeIcons() {
  return (
    <div className="decorative-icons-layer">

      {/* 1. Stethoscope — top-left, 280px, teal */}
      <svg className="decorative-icon" style={{ position:'absolute', top:'6%', left:'-2%', width:280, height:280, '--rot':'-15deg' }}
        viewBox="0 0 100 100" fill="none" stroke="rgba(14,158,138,0.13)" strokeWidth="2.5" strokeLinecap="round">
        <circle cx="30" cy="10" r="3"/>
        <circle cx="70" cy="10" r="3"/>
        <line x1="30" y1="13" x2="30" y2="28"/>
        <line x1="70" y1="13" x2="70" y2="28"/>
        <path d="M30 28 Q30 52 50 52 Q70 52 70 28"/>
        <line x1="50" y1="52" x2="50" y2="73"/>
        <circle cx="50" cy="80" r="8"/>
        <circle cx="50" cy="80" r="3" fill="rgba(14,158,138,0.10)" stroke="none"/>
      </svg>

      {/* 2. Caduceus / Medical cross — top-right, navy */}
      <svg className="decorative-icon" style={{ position:'absolute', top:'8%', right:'10%', width:240, height:240, '--rot':'10deg' }}
        viewBox="0 0 80 80" fill="none" stroke="rgba(26,31,54,0.07)" strokeWidth="2" strokeLinecap="round">
        {/* Staff */}
        <line x1="40" y1="5" x2="40" y2="75"/>
        {/* Wings */}
        <path d="M40 15 Q20 5 15 15 Q20 25 40 20"/>
        <path d="M40 15 Q60 5 65 15 Q60 25 40 20"/>
        {/* Snakes */}
        <path d="M40 20 Q25 30 35 40 Q45 50 30 60 Q20 65 25 72"/>
        <path d="M40 20 Q55 30 45 40 Q35 50 50 60 Q60 65 55 72"/>
        {/* Top knob */}
        <circle cx="40" cy="5" r="4"/>
      </svg>

      {/* 3. ECG / Heartbeat — wide band near top */}
      <svg className="decorative-icon" style={{ position:'absolute', top:'20%', left:'8%', width:500, height:70, '--rot':'0deg' }}
        viewBox="0 0 500 70" fill="none" stroke="rgba(14,158,138,0.10)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="0,35 80,35 105,35 118,8 128,62 138,18 152,55 165,35 500,35"/>
      </svg>

      {/* 4. Medical cross ×3 — scattered */}
      {[
        { top:'4%', right:'6%' },
        { top:'48%', left:'4%' },
        { bottom:'8%', right:'14%' },
      ].map((pos, i) => (
        <svg key={i} className="decorative-icon" style={{ position:'absolute', width:80, height:80, '--rot':'0deg', ...pos }}
          viewBox="0 0 80 80" stroke="rgba(14,158,138,0.15)" strokeWidth="1.5">
          <rect x="30" y="5" width="20" height="70" rx="4" fill="rgba(14,158,138,0.06)"/>
          <rect x="5" y="30" width="70" height="20" rx="4" fill="rgba(14,158,138,0.06)"/>
        </svg>
      ))}

      {/* 5. DNA Double Helix — right-center */}
      <svg className="decorative-icon" style={{ position:'absolute', top:'22%', right:'1%', width:80, height:260, '--rot':'5deg' }}
        viewBox="0 0 80 260" fill="none" stroke="rgba(14,158,138,0.12)" strokeWidth="2" strokeLinecap="round">
        <path d="M20,0 C60,30 60,60 20,90 C-20,120 60,150 20,180 C-20,210 60,240 20,260"/>
        <path d="M60,0 C20,30 20,60 60,90 C100,120 20,150 60,180 C100,210 20,240 60,260"/>
        <line x1="28" y1="22" x2="52" y2="18"/>
        <line x1="18" y1="45" x2="62" y2="45"/>
        <line x1="28" y1="68" x2="52" y2="72"/>
        <line x1="28" y1="112" x2="52" y2="118"/>
        <line x1="18" y1="135" x2="62" y2="135"/>
        <line x1="28" y1="158" x2="52" y2="162"/>
        <line x1="28" y1="202" x2="52" y2="208"/>
        <line x1="18" y1="225" x2="62" y2="225"/>
        <line x1="28" y1="248" x2="52" y2="242"/>
      </svg>

      {/* 6. Lungs outline — mid-right */}
      <svg className="decorative-icon" style={{ position:'absolute', top:'48%', right:'4%', width:240, height:200, '--rot':'8deg' }}
        viewBox="0 0 100 80" fill="none" stroke="rgba(14,158,138,0.11)" strokeWidth="2" strokeLinecap="round">
        {/* Trachea */}
        <line x1="50" y1="0" x2="50" y2="25"/>
        {/* Left bronchus + lung */}
        <path d="M50 25 Q35 28 30 38 Q18 40 14 55 Q10 70 22 74 Q34 78 36 65 Q38 55 30 50"/>
        {/* Right bronchus + lung */}
        <path d="M50 25 Q65 28 70 38 Q82 40 86 55 Q90 70 78 74 Q66 78 64 65 Q62 55 70 50"/>
      </svg>

      {/* 7. Brain outline — mid-left */}
      <svg className="decorative-icon" style={{ position:'absolute', top:'52%', left:'2%', width:220, height:180, '--rot':'-10deg' }}
        viewBox="0 0 100 80" fill="none" stroke="rgba(26,31,54,0.07)" strokeWidth="2" strokeLinecap="round">
        <path d="M50 70 L50 55"/>
        <path d="M50 55 Q30 52 22 42 Q10 30 16 18 Q22 8 34 10 Q38 6 50 8"/>
        <path d="M50 55 Q70 52 78 42 Q90 30 84 18 Q78 8 66 10 Q62 6 50 8"/>
        <path d="M22 35 Q16 42 20 50 Q26 56 36 54"/>
        <path d="M78 35 Q84 42 80 50 Q74 56 64 54"/>
        <path d="M30 18 Q28 28 32 36"/>
        <path d="M70 18 Q72 28 68 36"/>
        <path d="M40 10 Q38 22 42 32 Q46 40 50 38 Q54 40 58 32 Q62 22 60 10"/>
      </svg>

      {/* 8. Pill / Capsule — bottom-left */}
      <svg className="decorative-icon" style={{ position:'absolute', bottom:'18%', left:'7%', width:160, height:80, '--rot':'35deg' }}
        viewBox="0 0 100 50" fill="none" stroke="rgba(245,197,24,0.12)" strokeWidth="2.5" strokeLinecap="round">
        <path d="M25 5 L75 5 Q95 5 95 25 Q95 45 75 45 L25 45 Q5 45 5 25 Q5 5 25 5 Z"/>
        <line x1="50" y1="5" x2="50" y2="45"/>
      </svg>

      {/* 9. Syringe — bottom-right */}
      <svg className="decorative-icon" style={{ position:'absolute', bottom:'14%', right:'5%', width:200, height:80, '--rot':'-20deg' }}
        viewBox="0 0 120 50" fill="none" stroke="rgba(14,158,138,0.12)" strokeWidth="2" strokeLinecap="round">
        {/* Barrel */}
        <rect x="20" y="16" width="70" height="18" rx="5"/>
        {/* Plunger */}
        <line x1="90" y1="25" x2="115" y2="25"/>
        <line x1="108" y1="18" x2="108" y2="32"/>
        {/* Needle */}
        <line x1="20" y1="25" x2="5" y2="25"/>
        <path d="M5 25 L2 25"/>
        {/* Graduation marks */}
        <line x1="40" y1="16" x2="40" y2="12"/>
        <line x1="55" y1="16" x2="55" y2="12"/>
        <line x1="70" y1="16" x2="70" y2="12"/>
      </svg>

      {/* 10. Microscope — center-bottom */}
      <svg className="decorative-icon" style={{ position:'absolute', bottom:'4%', left:'42%', width:180, height:220, '--rot':'5deg' }}
        viewBox="0 0 80 100" fill="none" stroke="rgba(26,31,54,0.07)" strokeWidth="2" strokeLinecap="round">
        {/* Eyepiece */}
        <rect x="32" y="2" width="16" height="10" rx="3"/>
        {/* Tube */}
        <line x1="40" y1="12" x2="40" y2="45"/>
        {/* Arm */}
        <path d="M40 45 Q40 55 30 58"/>
        {/* Objective */}
        <circle cx="28" cy="62" r="7"/>
        {/* Stage */}
        <rect x="15" y="70" width="50" height="6" rx="2"/>
        {/* Base */}
        <path d="M20 76 Q10 85 10 90 L70 90 Q70 85 60 76"/>
        <ellipse cx="40" cy="90" rx="30" ry="5"/>
        {/* Focus knob */}
        <circle cx="65" cy="60" r="5"/>
        <line x1="65" y1="50" x2="65" y2="70"/>
      </svg>

      {/* 11. Blood drops ×3 — scattered */}
      {[
        { top:'35%', left:'22%' },
        { top:'62%', right:'22%' },
        { top:'15%', left:'50%' },
      ].map((pos, i) => (
        <svg key={i} className="decorative-icon" style={{ position:'absolute', width:50, height:60, '--rot':'0deg', ...pos }}
          viewBox="0 0 40 50" fill="none" stroke="rgba(14,158,138,0.12)" strokeWidth="2" strokeLinecap="round">
          <path d="M20 5 Q30 20 30 32 Q30 44 20 44 Q10 44 10 32 Q10 20 20 5 Z"/>
        </svg>
      ))}

    </div>
  );
}
