# Enhanced Mobile AI Investment Chatbot

This directory contains the enhanced mobile chatbot implementation with comprehensive investment AI features, following the patterns established in the backoffice system.

## 🚀 Features

### Investment-Specific AI Capabilities
- **Market Analysis**: Real-time market trends and insights
- **Portfolio Management**: Investment performance tracking and analysis
- **Price Predictions**: ML-powered property price estimates
- **Investment Recommendations**: AI-powered property suggestions
- **Legal Guidance**: Tunisia-specific real estate regulations
- **Data Analytics**: Role-based database insights and reports

### Enhanced User Experience
- **Quick Actions**: One-tap access to common investment queries
- **Smart Message Bubbles**: Contextual UI for different response types
- **Investment Insight Cards**: Specialized display for analytical data
- **Responsive Design**: Optimized for mobile interaction
- **Real-time Connection Status**: Visual feedback for API connectivity

### Technical Features
- **Role-Based Access**: Different capabilities based on user permissions
- **Authentication Integration**: Secure API calls with JWT tokens
- **Error Handling**: Graceful fallbacks and user-friendly messages
- **TypeScript Support**: Full type safety and IntelliSense
- **Component Architecture**: Modular, reusable components

## 📁 File Structure

```
chatbot/
├── index.tsx                    # Main chatbot screen (enhanced)
├── components/
│   ├── EnhancedMessageBubble.tsx   # Smart message display
│   ├── InvestmentInsightCard.tsx   # Data visualization card
│   ├── QuickActions.tsx            # Quick action buttons
│   └── index.ts                    # Barrel exports
├── api/
│   └── chatbotApi.ts              # Legacy API (deprecated)
└── README.md                      # This documentation
```

## 🛠️ Implementation Details

### AI Service Integration

The chatbot uses the enhanced `@/services/aiService` which provides:

```typescript
import { aiService } from '@/services/aiService';

// Process any query with intelligent routing
const response = await aiService.processQuery(query, voiceEnabled);

// Get specific investment insights
const insights = await aiService.getInvestmentInsights(query);

// Price predictions
const prediction = await aiService.getPricePrediction(request);

// Property recommendations
const recommendations = await aiService.getPropertyRecommendations(request);
```

### Component Usage

```typescript
import { 
  EnhancedMessageBubble, 
  InvestmentInsightCard, 
  QuickActions 
} from './components';

// Enhanced message display
<EnhancedMessageBubble 
  message={message} 
  onViewDetails={handleViewDetails} 
/>

// Quick action buttons
<QuickActions 
  onActionPress={handleQuickAction}
  isVisible={showQuickActions} 
/>

// Investment data display
<InvestmentInsightCard 
  insight={insightData}
  onViewDetails={openDetailedView} 
/>
```

## 🎯 Quick Start

1. **Import the enhanced service**:
   ```typescript
   import { aiService } from '@/services/aiService';
   ```

2. **Use the main chatbot screen**:
   ```typescript
   // The enhanced chatbot is already integrated in the tabs
   // Navigate to /main/screens/(tabs)/chatbot
   ```

3. **Customize quick actions** by modifying `INVESTMENT_SUGGESTIONS`

## 🔒 Security & Authentication

- **JWT Authentication**: Secure API communications
- **Role-Based Access**: Appropriate feature restrictions  
- **Input Validation**: Sanitized user inputs
- **Error Boundaries**: Graceful error handling

---

**Version**: 2.0.0 (Enhanced Investment AI) 