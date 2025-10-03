#include <WiFi.h>
#include <WebServer.h>
#include <Wire.h>
#include <LiquidCrystal_I2C.h>
#include <SPI.h>
#include <MFRC522.h>
#include <HTTPClient.h>

// ================== RFID ==================
#define SS_PIN 5
#define RST_PIN 21
MFRC522 rfid(SS_PIN, RST_PIN);

// ================== LCD ==================
LiquidCrystal_I2C lcd(0x27, 16, 2);

// ================== Buzzer ==================
const int buzzer = 33;

// ================== WiFi ==================
const char* ssid = "RevSinMax";      
const char* password = "alrightokay2";

// ================== ThingSpeak ==================
String serverName = "http://api.thingspeak.com/update";
String apiKey = "8ALF978NOUQXFU74";   // ThingSpeak Write API key

// ================== Timing ==================
unsigned long lastThingSpeak = 0;
const unsigned long thingSpeakInterval = 6000;

// ================== WiFi Setup ==================
void setupWiFi() {
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);

  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi connected: " + WiFi.localIP().toString());
}

// ================== ThingSpeak ==================
void sendToThingSpeak(String uid) {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("WiFi not connected");
    return;
  }

  unsigned long now = millis();
  if (now - lastThingSpeak < thingSpeakInterval) {
    Serial.println("Skipping ThingSpeak update to respect 5 sec limit");
    return;
  }

  HTTPClient http;
  String url = serverName + "?api_key=" + apiKey + "&field1=" + uid;
  Serial.println("Request URL: " + url);

  http.begin(url);
  int code = http.GET();
  if (code > 0) {
    Serial.println("ThingSpeak Response: " + String(code));
    String payload = http.getString();
    Serial.println("Response payload: " + payload);
  } else {
    Serial.println("HTTP request failed: " + String(code));
  }
  http.end();

  lastThingSpeak = now;
}

// ================== Buzzer ==================
void beep() {
  tone(buzzer, 1000);   // 1 kHz
  delay(200);
  noTone(buzzer);
}

// ================== Setup ==================
void setup() {
  Serial.begin(115200);

  // RFID
  SPI.begin(18, 19, 23, 5);
  rfid.PCD_Init();

  // LCD
  Wire.begin(14, 13);
  lcd.init();
  lcd.backlight();
  lcd.setCursor(0, 0); lcd.print("Smart Canteen");
  lcd.setCursor(0, 1); lcd.print("Scan Your Card");

  // Buzzer
  pinMode(buzzer, OUTPUT);

  // WiFi
  setupWiFi();
}

// ================== Loop ==================
void loop() {
  if (!rfid.PICC_IsNewCardPresent() || !rfid.PICC_ReadCardSerial()) return;

  // Build UID string
  String uid = "";
  for (byte i = 0; i < rfid.uid.size; i++) uid += String(rfid.uid.uidByte[i], HEX);
  uid.toUpperCase();
  Serial.println("Scanned UID: " + uid);

  // LCD Display
  lcd.clear(); 
  lcd.setCursor(0,0); lcd.print("Card Scanned");
  lcd.setCursor(0,1); lcd.print(uid);

  // Buzzer
  beep();

  // Send to ThingSpeak
  sendToThingSpeak(uid);

  // Stop RFID communication
  rfid.PICC_HaltA();
  rfid.PCD_StopCrypto1();
}
