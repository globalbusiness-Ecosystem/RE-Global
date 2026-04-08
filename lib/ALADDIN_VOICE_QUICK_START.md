# Aladdin Voice Advisor - Quick Reference

## 🎤 Quick Start

### Basic Usage
```typescript
import AIAdvisorVoiceChat from '@/components/ai-advisor-voice-chat';

// In your component:
{showAdvisor && (
  <AIAdvisorVoiceChat 
    language="ar"
    onClose={() => setShowAdvisor(false)}
    enableVoice={true}
  />
)}
```

## 🔊 Voice Commands

### For Users:
1. **Start Listening**: Click microphone button (or hold on mobile)
2. **Ask Question**: Speak naturally - "ما أفضل استثمار عقاري؟" or "What's the best property investment?"
3. **Read Response**: Auto-plays response (if auto-speak enabled)
4. **Continue Chat**: Type or speak another question

## 🎯 Key Features At a Glance

| Feature | Arabic | English | Mobile | Desktop |
|---------|--------|---------|--------|---------|
| Speech Recognition | ✅ ar-SA | ✅ en-US | ✅ | ✅ |
| Text-to-Speech | ✅ ar-SA | ✅ en-US | ✅ | ✅ |
| Auto Language Detect | ✅ | ✅ | ✅ | ✅ |
| Phone Integration | ✅ | ✅ | ✅ | ✅ |
| RTL Layout | ✅ | N/A | ✅ | ✅ |
| Accessibility | ✅ WCAG 2.1 | ✅ WCAG 2.1 | ✅ | ✅ |

## 📱 Device Support

### Mobile:
- ✅ iOS Safari (iPhone, iPad)
- ✅ Android Chrome
- ✅ Android Firefox
- ⚠️ Android Samsung Internet (limited)

### Desktop:
- ✅ Chrome/Chromium
- ✅ Firefox
- ✅ Safari
- ✅ Edge

## 🔧 Settings Panel

Access by clicking ⚙️ icon:

| Setting | Default | Options |
|---------|---------|---------|
| Auto-Speak | On | On/Off |
| Language | Detected | English/العربية |

## 🎨 UI Elements

### Top Bar:
- Title: "Aladdin Voice Advisor" / "مستشار علاء الدين الصوتي"
- Settings button (⚙️)
- Close button (✕)

### Controls:
- **Mic Button**: Start/Stop listening (Red when listening)
- **Send Button**: Send text message
- **Speaker Button**: Stop current speech
- **Phone Button**: WhatsApp link

### Status Indicators:
- 🔴 Red mic = Listening
- 🟡 Gold speech = Speaking
- 🟢 Green button = Ready
- 🔘 Gray = Disabled

## 💬 Example Conversations

### Arabic Example:
```
User: "ما أفضل استثمار عقاري لـ 20 π؟"
Aladdin: "يمكنك الاستثمار في عقارات رمزية في دبي، 
بعائد سنوي 12-15%..."
```

### English Example:
```
User: "Best property investment for $5000?"
Aladdin: "Consider tokenized real estate in Dubai 
with 12-15% annual ROI..."
```

## ⚠️ Troubleshooting

### Problem: Microphone Not Working
**Solution:**
1. Check browser permissions (Settings → Microphone)
2. Ensure HTTPS connection
3. Try refresh (F5)
4. Try different browser

### Problem: No Speech Recognition
**Solution:**
1. Check internet connection
2. Verify language is set correctly
3. Speak clearly and naturally
4. Wait for "Listening..." indicator

### Problem: Speech Synthesis Not Playing
**Solution:**
1. Check volume settings (system + browser)
2. Verify auto-speak is enabled in settings
3. Try different browser
4. Disable browser extensions (ad blockers)

### Problem: RTL Text Not Displaying
**Solution:**
1. Clear browser cache
2. Hard refresh (Ctrl+Shift+R)
3. Check browser language settings
4. Verify Arabic language is selected

## 📊 Performance Tips

1. **Mobile**: Close unnecessary browser tabs
2. **Reduce Latency**: Use 4G/5G or WiFi
3. **Better Recognition**: Speak naturally, no background noise
4. **Faster Responses**: Keep conversation focused

## 🔐 Privacy & Security

- ✅ No audio saved on servers
- ✅ Local speech processing
- ✅ Encrypted communications (HTTPS)
- ✅ No audio tracking
- ✅ Automatic cleanup on close

## 📞 Support Resources

| Type | Link | Language |
|------|------|----------|
| WhatsApp | +201010810558 | EN/AR |
| Email | globalbusiness435@gmail.com | EN |
| Website | alshaibgroup.pi | EN |

## 🎯 Pro Tips

1. **Keyboard Backup**: Always can type instead of speaking
2. **Language Mix**: Can switch mid-conversation
3. **Settings**: Customize experience before asking
4. **Follow-ups**: Build on previous answers
5. **Technical Qs**: Include specific numbers/locations
6. **Investment**: Ask about ROI, tax, legal factors

## ✅ Supported Question Types

- Market analysis: "What's happening in Dubai real estate?"
- Investment advice: "Where should I invest 50π?"
- Legal questions: "What are USA property laws?"
- Financial: "What's the ROI on Egyptian properties?"
- Technical: "How does Pi Network work?"
- Visa programs: "Tell me about Golden Visa options"

## 🚀 Keyboard Shortcuts

| Key | Action |
|-----|--------|
| Enter | Send message |
| Esc | Close advisor |
| Space | (When focused on mic) Start/Stop listening |

## 📈 Version Info

- **Current**: v1.0
- **Release**: 2026-04-02
- **Status**: Production Ready
- **Support**: Full Arabic & English

## 🎓 Learning Resources

- [Complete Guide](/lib/ALADDIN_VOICE_COMPLETE_GUIDE.md)
- [API Documentation](/app/api/claude-advisor/route.ts)
- [Component Source](/components/ai-advisor-voice-chat.tsx)
- [Voice Service](/lib/voice-service.ts)

---

**Need Help?** 
- 📱 WhatsApp: +201010810558
- 💬 In-app: Use the phone button to contact support
