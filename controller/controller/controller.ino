#define BUTTON_DOWN  PA0
#define BUTTON_LEFT  PA1
#define BUTTON_UP    PA2  
#define BUTTON_RIGHT PA3

#define DEBOUNCE_DELAY 50

#define JOY1_X_PIN    PA4
#define JOY1_Y_PIN    PA5
#define JOY2_X_PIN    PA6
#define JOY2_Y_PIN    PA7

#define CAL_BUTTON    PC13
#define CALIBRATION_TIME 5000
#define DEADZONE_PERCENT 5
#define JOYSTICK_SAMPLE_INTERVAL 50

struct JoystickCal {
  int x_min = 4095;
  int x_max = 0;
  int y_min = 4095;
  int y_max = 0;
};

JoystickCal joy1, joy2;

unsigned long lastDebounceTime[4] = {0};
bool lastButtonState[4] = {HIGH, HIGH, HIGH, HIGH};
bool buttonState[4] = {HIGH, HIGH, HIGH, HIGH};
const char* buttonNames[] = {"DOWN", "LEFT", "UP", "RIGHT"};
const int buttonPins[] = {BUTTON_DOWN, BUTTON_LEFT, BUTTON_UP, BUTTON_RIGHT};

int joy1_x = 0, joy1_y = 0;
int joy2_x = 0, joy2_y = 0;
int lastJoy1_x = 0, lastJoy1_y = 0;
int lastJoy2_x = 0, lastJoy2_y = 0;
unsigned long lastJoystickRead = 0;

bool calibrating = true;
unsigned long calibrationStart = 0;

int joy1_left = 0, joy1_right = 0, joy1_up = 0, joy1_down = 0;
int joy2_left = 0, joy2_right = 0, joy2_up = 0, joy2_down = 0;

void setup() {
  Serial.begin(115200);
  while (!Serial) delay(10);
  
  for (int i = 0; i < 4; i++) {
    pinMode(buttonPins[i], INPUT_PULLUP);
    lastButtonState[i] = digitalRead(buttonPins[i]);
    buttonState[i] = lastButtonState[i];
  }
  
  pinMode(JOY1_X_PIN, INPUT_ANALOG);
  pinMode(JOY1_Y_PIN, INPUT_ANALOG);
  pinMode(JOY2_X_PIN, INPUT_ANALOG);
  pinMode(JOY2_Y_PIN, INPUT_ANALOG);
  pinMode(CAL_BUTTON, INPUT_PULLUP);
  
  calibrating = true;
  calibrationStart = millis();
}

void loop() {
  if (calibrating) {
    int j1x = analogRead(JOY1_X_PIN);
    int j1y = analogRead(JOY1_Y_PIN);
    int j2x = analogRead(JOY2_X_PIN);
    int j2y = analogRead(JOY2_Y_PIN);
    
    if (j1x < joy1.x_min) joy1.x_min = j1x;
    if (j1x > joy1.x_max) joy1.x_max = j1x;
    if (j1y < joy1.y_min) joy1.y_min = j1y;
    if (j1y > joy1.y_max) joy1.y_max = j1y;
    if (j2x < joy2.x_min) joy2.x_min = j2x;
    if (j2x > joy2.x_max) joy2.x_max = j2x;
    if (j2y < joy2.y_min) joy2.y_min = j2y;
    if (j2y > joy2.y_max) joy2.y_max = j2y;
    
    if (digitalRead(CAL_BUTTON) == LOW || millis() > calibrationStart + CALIBRATION_TIME) {
      calibrating = false;
    }
    return;
  }
  
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
    
    joy1_x = analogRead(JOY1_X_PIN);
    joy1_y = analogRead(JOY1_Y_PIN);
    joy2_x = analogRead(JOY2_X_PIN);
    joy2_y = analogRead(JOY2_Y_PIN);
    
    int center1x = (joy1.x_min + joy1.x_max) / 2;
    int center1y = (joy1.y_min + joy1.y_max) / 2;
    int center2x = (joy2.x_min + joy2.x_max) / 2;
    int center2y = (joy2.y_min + joy2.y_max) / 2;
    
    if (joy1_x <= center1x) {
      joy1_left = map(joy1_x, joy1.x_min, center1x, 100, 0);
      joy1_right = 0;
    } else {
      joy1_left = 0;
      joy1_right = map(joy1_x, center1x, joy1.x_max, 0, 100);
    }
    
    if (joy1_y <= center1y) {
      joy1_up = map(joy1_y, joy1.y_min, center1y, 100, 0);
      joy1_down = 0;
    } else {
      joy1_up = 0;
      joy1_down = map(joy1_y, center1y, joy1.y_max, 0, 100);
    }
    
    if (joy2_x <= center2x) {
      joy2_left = map(joy2_x, joy2.x_min, center2x, 100, 0);
      joy2_right = 0;
    } else {
      joy2_left = 0;
      joy2_right = map(joy2_x, center2x, joy2.x_max, 0, 100);
    }
    
    if (joy2_y <= center2y) {
      joy2_up = map(joy2_y, joy2.y_min, center2y, 100, 0);
      joy2_down = 0;
    } else {
      joy2_up = 0;
      joy2_down = map(joy2_y, center2y, joy2.y_max, 0, 100);
    }
    
    joy1_left = constrain(joy1_left, 0, 100);
    joy1_right = constrain(joy1_right, 0, 100);
    joy1_up = constrain(joy1_up, 0, 100);
    joy1_down = constrain(joy1_down, 0, 100);
    joy2_left = constrain(joy2_left, 0, 100);
    joy2_right = constrain(joy2_right, 0, 100);
    joy2_up = constrain(joy2_up, 0, 100);
    joy2_down = constrain(joy2_down, 0, 100);
    
    if (joy1_left < DEADZONE_PERCENT) joy1_left = 0;
    if (joy1_right < DEADZONE_PERCENT) joy1_right = 0;
    if (joy1_up < DEADZONE_PERCENT) joy1_up = 0;
    if (joy1_down < DEADZONE_PERCENT) joy1_down = 0;
    if (joy2_left < DEADZONE_PERCENT) joy2_left = 0;
    if (joy2_right < DEADZONE_PERCENT) joy2_right = 0;
    if (joy2_up < DEADZONE_PERCENT) joy2_up = 0;
    if (joy2_down < DEADZONE_PERCENT) joy2_down = 0;
    
    Serial.print(joy1_left);
    Serial.print(",");
    Serial.print(joy1_right);
    Serial.print(",");
    Serial.print(joy1_up);
    Serial.print(",");
    Serial.print(joy1_down);
    Serial.print(",");
    Serial.print(joy2_left);
    Serial.print(",");
    Serial.print(joy2_right);
    Serial.print(",");
    Serial.print(joy2_up);
    Serial.print(",");
    Serial.println(joy2_down);
  }
  
  delay(10);
}