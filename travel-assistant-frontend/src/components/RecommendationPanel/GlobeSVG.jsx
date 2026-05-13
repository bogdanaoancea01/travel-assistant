export function GlobeSVG() {
  return (
    <svg width="200" height="200" viewBox="0 0 200 200" role="img" aria-label="Earth globe with destination pins">
      <title>Globe illustration</title>
      <defs>
        <clipPath id="gc">
          <circle cx="100" cy="100" r="78" />
        </clipPath>
        <linearGradient id="og" x1="0.2" y1="0" x2="0.8" y2="1">
          <stop offset="0%" stopColor="#B8DFF0" />
          <stop offset="100%" stopColor="#6DB8D8" />
        </linearGradient>
        <linearGradient id="lg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.08" />
        </linearGradient>
        <radialGradient id="sh" cx="0.35" cy="0.3" r="0.65">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.0" />
        </radialGradient>
      </defs>

      {/* Ocean */}
      <circle cx="100" cy="100" r="78" fill="url(#og)" />

      <g clipPath="url(#gc)">
        {/* Grid lines */}
        <line x1="22" y1="100" x2="178" y2="100" stroke="#ffffff" strokeWidth="0.5" opacity="0.3" />
        <line x1="100" y1="22" x2="100" y2="178" stroke="#ffffff" strokeWidth="0.5" opacity="0.2" />
        <ellipse cx="100" cy="100" rx="78" ry="24" fill="none" stroke="#ffffff" strokeWidth="0.5" opacity="0.25" />
        <ellipse cx="100" cy="100" rx="78" ry="52" fill="none" stroke="#ffffff" strokeWidth="0.4" opacity="0.18" />
        <ellipse cx="100" cy="78" rx="78" ry="18" fill="none" stroke="#ffffff" strokeWidth="0.4" opacity="0.15" />
        <ellipse cx="100" cy="122" rx="78" ry="18" fill="none" stroke="#ffffff" strokeWidth="0.4" opacity="0.15" />
        <ellipse cx="100" cy="100" rx="30" ry="78" fill="none" stroke="#ffffff" strokeWidth="0.4" opacity="0.15" />
        <ellipse cx="100" cy="100" rx="58" ry="78" fill="none" stroke="#ffffff" strokeWidth="0.4" opacity="0.12" />

        {/* North America */}
        <path d="M32 58 C34 52 40 48 46 50 C50 48 54 46 58 50 C62 49 66 51 67 55
                 C70 54 74 55 75 59 C76 64 72 68 70 72 C72 75 71 80 68 83
                 C65 88 60 90 56 88 C52 92 48 93 45 90 C42 93 38 91 37 87
                 C34 84 34 79 36 76 C33 72 31 66 32 61 Z"
              fill="#4CAF80" opacity="0.88" />
        {/* Greenland */}
        <path d="M68 38 C72 34 80 34 83 38 C86 42 84 50 80 52 C76 54 70 52 68 48 C66 44 66 41 68 38 Z"
              fill="#4CAF80" opacity="0.82" />
        {/* Central America */}
        <path d="M56 90 C58 88 62 90 63 94 C62 98 59 100 57 98 C55 96 55 92 56 90 Z"
              fill="#4CAF80" opacity="0.82" />
        {/* South America */}
        <path d="M60 102 C64 98 72 98 76 102 C80 106 82 112 80 118
                 C82 124 80 132 76 138 C72 144 66 146 62 142
                 C58 138 56 132 57 126 C55 120 55 112 58 106 Z"
              fill="#4CAF80" opacity="0.85" />

        {/* Europe */}
        <path d="M96 52 C100 48 106 48 109 52 C112 50 116 52 116 56
                 C118 59 116 63 113 64 C114 67 112 70 109 70
                 C106 72 103 70 102 67 C99 68 96 66 96 63
                 C93 61 93 55 96 52 Z"
              fill="#4CAF80" opacity="0.88" />
        {/* Scandinavia */}
        <path d="M100 44 C102 40 106 40 107 44 C108 48 106 52 103 52 C100 52 99 48 100 44 Z"
              fill="#4CAF80" opacity="0.8" />
        {/* UK */}
        <path d="M92 52 C94 50 96 52 96 55 C96 58 94 60 92 59 C90 58 90 54 92 52 Z"
              fill="#4CAF80" opacity="0.78" />

        {/* Africa */}
        <path d="M100 68 C106 66 114 68 117 74 C120 80 119 88 117 94
                 C120 100 119 108 116 114 C112 122 106 126 100 124
                 C94 126 88 122 86 115 C83 108 83 100 86 94
                 C83 88 84 80 87 74 C90 68 95 66 100 68 Z"
              fill="#4CAF80" opacity="0.87" />
        {/* Madagascar */}
        <path d="M122 104 C124 100 127 101 127 105 C127 110 125 115 122 115 C120 113 120 107 122 104 Z"
              fill="#4CAF80" opacity="0.78" />

        {/* Russia / Asia north */}
        <path d="M118 46 C124 42 136 42 142 46 C148 50 150 56 147 61
                 C152 63 155 68 152 72 C155 76 154 82 150 84
                 C146 88 140 88 136 85 C132 90 126 90 122 86
                 C118 90 112 88 110 83 C107 78 108 72 112 69
                 C109 65 109 58 113 54 Z"
              fill="#4CAF80" opacity="0.86" />
        {/* China / SE Asia */}
        <path d="M136 72 C142 70 150 72 153 78 C156 84 154 92 150 96
                 C154 100 153 107 149 110 C145 114 139 114 135 110
                 C131 114 126 112 124 107 C121 102 122 94 126 90
                 C122 85 122 77 126 74 Z"
              fill="#4CAF80" opacity="0.85" />
        {/* India */}
        <path d="M122 86 C126 84 130 86 131 91 C132 97 130 104 127 108
                 C124 112 120 112 118 107 C115 102 115 94 118 89 Z"
              fill="#4CAF80" opacity="0.84" />
        {/* Japan */}
        <path d="M158 66 C160 63 163 64 163 68 C163 72 161 76 158 76 C156 74 156 69 158 66 Z"
              fill="#4CAF80" opacity="0.78" />
        {/* SE Asia islands */}
        <path d="M148 110 C152 108 156 110 156 114 C156 118 153 120 150 119 C147 118 146 113 148 110 Z"
              fill="#4CAF80" opacity="0.75" />

        {/* Australia */}
        <path d="M144 122 C150 118 160 118 165 124 C170 130 169 140 165 146
                 C161 152 153 154 147 150 C141 148 137 140 138 133
                 C138 127 140 124 144 122 Z"
              fill="#4CAF80" opacity="0.85" />
        {/* New Zealand */}
        <path d="M170 150 C172 147 175 148 175 152 C175 156 173 158 170 157 C168 155 168 152 170 150 Z"
              fill="#4CAF80" opacity="0.72" />

        {/* Antarctica */}
        <path d="M40 165 C60 158 80 155 100 154 C120 155 140 158 160 165 C155 172 130 176 100 176 C70 176 45 172 40 165 Z"
              fill="#E8F4F8" opacity="0.7" />
        {/* Arctic ice cap */}
        <path d="M72 28 C80 22 100 20 120 24 C130 28 130 35 120 38 C110 36 90 36 80 38 C70 36 68 32 72 28 Z"
              fill="#E8F4F8" opacity="0.65" />

        {/* Light sheen */}
        <circle cx="100" cy="100" r="78" fill="url(#sh)" />
        <circle cx="100" cy="100" r="78" fill="url(#lg)" />
      </g>

      {/* Globe border */}
      <circle cx="100" cy="100" r="78" fill="none" stroke="#3A90B8" strokeWidth="1.5" />
      <circle cx="100" cy="100" r="78" fill="none" stroke="#ffffff" strokeWidth="0.5" opacity="0.4" />

      {/* Tokyo pin */}
      <line x1="152" y1="74" x2="152" y2="60" stroke="#1a5276" strokeWidth="1.2" />
      <circle cx="152" cy="74" r="5" fill="#1a5276" />
      <circle cx="152" cy="74" r="3" fill="#5DADE2" />
      <rect x="133" y="50" width="38" height="14" rx="7" fill="#1a5276" />
      <text x="152" y="60.5" textAnchor="middle" fontSize="8" fill="#AED6F1" fontFamily="sans-serif" fontWeight="600">Tokyo</text>

      {/* Barcelona pin */}
      <line x1="104" y1="64" x2="96" y2="50" stroke="#1a5276" strokeWidth="1.2" />
      <circle cx="104" cy="64" r="5" fill="#1a5276" />
      <circle cx="104" cy="64" r="3" fill="#5DADE2" />
      <rect x="68" y="40" width="56" height="14" rx="7" fill="#1a5276" />
      <text x="96" y="50.5" textAnchor="middle" fontSize="8" fill="#AED6F1" fontFamily="sans-serif" fontWeight="600">Barcelona</text>

      {/* Lisbon pin */}
      <line x1="94" y1="72" x2="74" y2="82" stroke="#1a5276" strokeWidth="1.2" />
      <circle cx="94" cy="72" r="5" fill="#1a5276" />
      <circle cx="94" cy="72" r="3" fill="#5DADE2" />
      <rect x="44" y="76" width="38" height="14" rx="7" fill="#1a5276" />
      <text x="63" y="86.5" textAnchor="middle" fontSize="8" fill="#AED6F1" fontFamily="sans-serif" fontWeight="600">Lisbon</text>
    </svg>
  );
}