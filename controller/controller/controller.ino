#define BUTTON_DOWN  PA0
#define BUTTON_LEFT  PA1
#define BUTTON_UP    PA2  
#define BUTTON_RIGHT PA3

#define DEBOUNCE_DELAY 50

unsigned long lastDebounceTime[4] = {0};
bool lastButtonState[4] = {HIGH, HIGH, HIGH, HIGH};
bool buttonState[4] = {HIGH, HIGH, HIGH, HIGH};
const char* buttonNames[] = {"DOWN", "LEFT", "UP", "RIGHT"};
const int buttonPins[] = {BUTTON_DOWN, BUTTON_LEFT, BUTTON_UP, BUTTON_RIGHT};

void setup() {
  Serial.begin(115200);
  while (!Serial) delay(10);
  
  Serial.println("STM32F411 Button Reader - Reliable Pins");
  Serial.println("Using PA0, PA1, PA2, PA3");
  
  for (int i = 0; i < 4; i++) {
    pinMode(buttonPins[i], INPUT_PULLUP);
    lastButtonState[i] = digitalRead(buttonPins[i]);
    buttonState[i] = lastButtonState[i];
  }
  
  Serial.println("Ready!");
}

void loop() {
  for (int i = 0; i < 4; i++) {
    bool reading = digitalRead(buttonPins[i]);
    
    if (reading != lastButtonState[i]) {
      lastDebounceTime[i] = millis();
    }
    
    if ((millis() - lastDebounceTime[i]) > DEBOUNCE_DELAY) {
      if (reading != buttonState[i]) {
        buttonState[i] = reading;
        
        if (buttonState[i] == LOW) {
          Serial.print(buttonNames[i]);
          Serial.println(": PRESSED");
        } else {
          Serial.print(buttonNames[i]);
          Serial.println(": released");
        }
      }
    }
    
    lastButtonState[i] = reading;
  }
  
  delay(10);
}