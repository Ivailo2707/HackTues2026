#define BUTTON_DOWN  PA0
#define BUTTON_LEFT  PA1
#define BUTTON_UP    PA2  
#define BUTTON_RIGHT PA3

#define DEBOUNCE_DELAY 50

#define JOY1_X_PIN    PA4
#define JOY1_Y_PIN    PA5
#define JOY2_X_PIN    PA6
#define JOY2_Y_PIN    PA7

#define CALIBRATION_TIME 5000
#define DEADZONE_PERCENT 8
#define JOYSTICK_SAMPLE_INTERVAL 50
#define SMOOTHING_FACTOR 3

#define STATUS_LED PC13

struct JoystickCal {
  int x_min = 4095;
  int x_max = 0;
  int y_min = 4095;
  int y_max = 0;
  int x_center = 2048;
  int y_center = 2048;
};

JoystickCal joy1, joy2;

unsigned long lastDebounceTime[4] = {0};
bool lastButtonState[4] = {HIGH, HIGH, HIGH, HIGH};
bool buttonState[4] = {HIGH, HIGH, HIGH, HIGH};
const char* buttonNames[] = {"DOWN", "LEFT", "UP", "RIGHT"};
const int buttonPins[] = {BUTTON_DOWN, BUTTON_LEFT, BUTTON_UP, BUTTON_RIGHT};

unsigned long lastJoystickRead = 0;

bool calibrating = true;
unsigned long calibrationStart = 0;
int calibrationStage = 0;

int joy1_x_filtered = 0, joy1_y_filtered = 0;
int joy2_x_filtered = 0, joy2_y_filtered = 0;

void setup() {
  Serial.begin(115200);
  while (!Serial) delay(10);
  
  pinMode(STATUS_LED, OUTPUT);
  digitalWrite(STATUS_LED, LOW);
  
  for (int i = 0; i < 4; i++) {
    pinMode(buttonPins[i], INPUT_PULLUP);
    lastButtonState[i] = digitalRead(buttonPins[i]);
    buttonState[i] = lastButtonState[i];
  }
  
  pinMode(JOY1_X_PIN, INPUT_ANALOG);
  pinMode(JOY1_Y_PIN, INPUT_ANALOG);
  pinMode(JOY2_X_PIN, INPUT_ANALOG);
  pinMode(JOY2_Y_PIN, INPUT_ANALOG);
  
  calibrating = true;
  calibrationStart = millis();
  calibrationStage = 0;
  
  Serial.println("=== CALIBRATION START ===");
  Serial.println("STAGE 1: Release both joysticks to center position");
  Serial.println("Keep them centered for 5 seconds...");
  Serial.println();
  
  digitalWrite(STATUS_LED, HIGH);
}

void updateLED(int stage, int progress = 0, int total = 0) {
  static unsigned long lastBlink = 0;
  static bool ledState = LOW;
  unsigned long now = millis();
  
  if (stage == 0) {
    if (now - lastBlink >= 500) {
      lastBlink = now;
      ledState = !ledState;
      digitalWrite(STATUS_LED, ledState);
    }
  } 
  else if (stage == 1) {
    if (now - lastBlink >= 100) {
      lastBlink = now;
      ledState = !ledState;
      digitalWrite(STATUS_LED, ledState);
    }
  }
  else if (stage == 2) {
    digitalWrite(STATUS_LED, HIGH);
  }
}

int normalizeJoystick(int raw_value, int min_val, int max_val, int center) {
  if (raw_value <= center) {
    int range = center - min_val;
    if (range <= 0) return 0;
    
    float percent = ((float)(center - raw_value) / range) * 100;
    int value = -percent;
    return constrain(value, -100, 0);
    
  } else {
    int range = max_val - center;
    if (range <= 0) return 0;
    
    float percent = ((float)(raw_value - center) / range) * 100;
    int value = percent;
    return constrain(value, 0, 100);
  }
}

int applySmoothing(int newValue, int filteredValue) {
  return (filteredValue * (SMOOTHING_FACTOR - 1) + newValue) / SMOOTHING_FACTOR;
}

void loop() {
  if (calibrating) {
    int j1x = analogRead(JOY1_X_PIN);
    int j1y = analogRead(JOY1_Y_PIN);
    int j2x = analogRead(JOY2_X_PIN);
    int j2y = analogRead(JOY2_Y_PIN);
    
    if (calibrationStage == 0) {
      updateLED(0);
      
      static int centerSamples[4][10] = {0};
      static int centerSampleCount = 0;
      
      if (centerSampleCount < 10) {
        centerSamples[0][centerSampleCount] = j1x;
        centerSamples[1][centerSampleCount] = j1y;
        centerSamples[2][centerSampleCount] = j2x;
        centerSamples[3][centerSampleCount] = j2y;
        centerSampleCount++;
        
        Serial.print("Sampling center position: ");
        Serial.print(centerSampleCount);
        Serial.println("/10");
        delay(100);
        
        if (centerSampleCount == 10) {
          long sum1x = 0, sum1y = 0, sum2x = 0, sum2y = 0;
          for (int i = 0; i < 10; i++) {
            sum1x += centerSamples[0][i];
            sum1y += centerSamples[1][i];
            sum2x += centerSamples[2][i];
            sum2y += centerSamples[3][i];
          }
          
          joy1.x_center = sum1x / 10;
          joy1.y_center = sum1y / 10;
          joy2.x_center = sum2x / 10;
          joy2.y_center = sum2y / 10;
          
          joy1.x_min = joy1.x_center;
          joy1.x_max = joy1.x_center;
          joy1.y_min = joy1.y_center;
          joy1.y_max = joy1.y_center;
          joy2.x_min = joy2.x_center;
          joy2.x_max = joy2.x_center;
          joy2.y_min = joy2.y_center;
          joy2.y_max = joy2.y_center;
          
          calibrationStage = 1;
          calibrationStart = millis();
          
          Serial.println("\n=== STAGE 2: Move joysticks to ALL extremes ===");
          Serial.println("Move both joysticks in full circles for 5 seconds");
          Serial.println();
        }
      }
    } 
    else if (calibrationStage == 1) {
      updateLED(1);
      
      if (j1x < joy1.x_min) joy1.x_min = j1x;
      if (j1x > joy1.x_max) joy1.x_max = j1x;
      if (j1y < joy1.y_min) joy1.y_min = j1y;
      if (j1y > joy1.y_max) joy1.y_max = j1y;
      if (j2x < joy2.x_min) joy2.x_min = j2x;
      if (j2x > joy2.x_max) joy2.x_max = j2x;
      if (j2y < joy2.y_min) joy2.y_min = j2y;
      if (j2y > joy2.y_max) joy2.y_max = j2y;
      
      unsigned long remaining = (calibrationStart + CALIBRATION_TIME - millis()) / 1000;
      static unsigned long lastTimePrint = 0;
      if (millis() - lastTimePrint > 1000 && remaining <= 5) {
        lastTimePrint = millis();
        Serial.print("Calibrating extremes... ");
        Serial.print(remaining);
        Serial.println(" seconds remaining");
      }
      
      if (millis() > calibrationStart + CALIBRATION_TIME) {
        calibrating = false;
        
        updateLED(2);
        
        Serial.println();
        Serial.println("=== CALIBRATION COMPLETE ===");
        Serial.println("Joystick 1:");
        Serial.print("  X Axis - Min: "); Serial.print(joy1.x_min);
        Serial.print(", Center: "); Serial.print(joy1.x_center);
        Serial.print(", Max: "); Serial.println(joy1.x_max);
        Serial.print("    Range: "); Serial.print(joy1.x_max - joy1.x_min);
        Serial.println(" ADC units");
        Serial.print("  Y Axis - Min: "); Serial.print(joy1.y_min);
        Serial.print(", Center: "); Serial.print(joy1.y_center);
        Serial.print(", Max: "); Serial.println(joy1.y_max);
        Serial.print("    Range: "); Serial.print(joy1.y_max - joy1.y_min);
        Serial.println(" ADC units");
        Serial.println("Joystick 2:");
        Serial.print("  X Axis - Min: "); Serial.print(joy2.x_min);
        Serial.print(", Center: "); Serial.print(joy2.x_center);
        Serial.print(", Max: "); Serial.println(joy2.x_max);
        Serial.print("    Range: "); Serial.print(joy2.x_max - joy2.x_min);
        Serial.println(" ADC units");
        Serial.print("  Y Axis - Min: "); Serial.print(joy2.y_min);
        Serial.print(", Center: "); Serial.print(joy2.y_center);
        Serial.print(", Max: "); Serial.println(joy2.y_max);
        Serial.print("    Range: "); Serial.print(joy2.y_max - joy2.y_min);
        Serial.println(" ADC units");
        Serial.println();
        Serial.println("Output format: J1_X,J1_Y,J2_X,J2_Y");
        Serial.println("Neutral position = 0 for all axes");
        Serial.println("Values range from -100 to +100");
        Serial.println("================================\n");
      }
    }
    return;
  }
  
  digitalWrite(STATUS_LED, HIGH);
  
  for (int i = 0; i < 4; i++) {
    bool reading = digitalRead(buttonPins[i]);
    
    if (reading != lastButtonState[i]) {
      lastDebounceTime[i] = millis();
    }
    
    if ((millis() - lastDebounceTime[i]) > DEBOUNCE_DELAY) {
      if (reading != buttonState[i]) {
        buttonState[i] = reading;
        
        if (buttonState[i] == LOW) {
          Serial.print("[BUTTON] ");
          Serial.print(buttonNames[i]);
          Serial.println(" PRESSED");
        } else {
          Serial.print("[BUTTON] ");
          Serial.print(buttonNames[i]);
          Serial.println(" released");
        }
      }
    }
    
    lastButtonState[i] = reading;
  }
  
  unsigned long currentMillis = millis();
  if (currentMillis - lastJoystickRead >= JOYSTICK_SAMPLE_INTERVAL) {
    lastJoystickRead = currentMillis;
    
    int raw_j1x = analogRead(JOY1_X_PIN);
    int raw_j1y = analogRead(JOY1_Y_PIN);
    int raw_j2x = analogRead(JOY2_X_PIN);
    int raw_j2y = analogRead(JOY2_Y_PIN);
    
    static int last_raw_j1x = 0, last_raw_j1y = 0, last_raw_j2x = 0, last_raw_j2y = 0;
    raw_j1x = (raw_j1x + last_raw_j1x) / 2;
    raw_j1y = (raw_j1y + last_raw_j1y) / 2;
    raw_j2x = (raw_j2x + last_raw_j2x) / 2;
    raw_j2y = (raw_j2y + last_raw_j2y) / 2;
    last_raw_j1x = raw_j1x;
    last_raw_j1y = raw_j1y;
    last_raw_j2x = raw_j2x;
    last_raw_j2y = raw_j2y;
    
    int new_j1x = normalizeJoystick(raw_j1x, joy1.x_min, joy1.x_max, joy1.x_center);
    int new_j1y = normalizeJoystick(raw_j1y, joy1.y_min, joy1.y_max, joy1.y_center);
    int new_j2x = normalizeJoystick(raw_j2x, joy2.x_min, joy2.x_max, joy2.x_center);
    int new_j2y = normalizeJoystick(raw_j2y, joy2.y_min, joy2.y_max, joy2.y_center);
    
    joy1_x_filtered = applySmoothing(new_j1x, joy1_x_filtered);
    joy1_y_filtered = applySmoothing(new_j1y, joy1_y_filtered);
    joy2_x_filtered = applySmoothing(new_j2x, joy2_x_filtered);
    joy2_y_filtered = applySmoothing(new_j2y, joy2_y_filtered);
    
    int deadzone = DEADZONE_PERCENT;
    if (abs(joy1_x_filtered) < deadzone) joy1_x_filtered = 0;
    if (abs(joy1_y_filtered) < deadzone) joy1_y_filtered = 0;
    if (abs(joy2_x_filtered) < deadzone) joy2_x_filtered = 0;
    if (abs(joy2_y_filtered) < deadzone) joy2_y_filtered = 0;
    
    Serial.print(joy1_x_filtered);
    Serial.print(",");
    Serial.print(joy1_y_filtered);
    Serial.print(",");
    Serial.print(joy2_x_filtered);
    Serial.print(",");
    Serial.println(joy2_y_filtered);
  }
  
  delay(10);
}