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

// ================== LEDs & Buzzer ==================
const int grantLED = 4;
const int denyLED = 2;
const int buzzer = 33;

// ================== WiFi ==================
const char* ssid = "RevSinMax";      
const char* password = "alrightokay2";
WebServer server(80);
String mode = "order";  // default

// ================== ThingSpeak ==================
String serverName = "http://api.thingspeak.com/update";
String apiKey = "FDM1F935F6ORH1RL";   // ThingSpeak Write API key

// ================== Data ==================
struct User {
  String uid;
  String name;
};
User users[10];
int userCount = 0;

// ================== WiFi Setup ==================
void setupWiFi() {
  WiFi.mode(WIFI_AP_STA);  // both AP + STA
  WiFi.softAP("CanteenSystem", "12345678");
  WiFi.begin(ssid, password);

  Serial.print("Connecting STA");
  int retries = 0;
  while (WiFi.status() != WL_CONNECTED && retries < 20) {
    delay(500);
    Serial.print(".");
    retries++;
  }
  Serial.println(WiFi.isConnected() ? "\nWiFi connected: " + WiFi.localIP().toString()
                                    : "\nSTA failed, AP only mode");
  Serial.print("AP IP: "); Serial.println(WiFi.softAPIP());
}

// ================== Web UI ==================
void setupWeb() {
  server.on("/", []() {
    String html = R"rawliteral(
    <!DOCTYPE html>
    <html lang=\"en\">
    <head>
      <meta charset=\"UTF-8\">
      <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">
      <title>Smart Canteen Management</title>
      <style>
        body { font-family: Arial; background:#f4f6f9; text-align:center; padding:40px; }
        .box { background:#fff; padding:25px; border-radius:12px; display:inline-block; }
        h1 { color:#333; }
        .mode { margin:15px 0; font-weight:bold; color:#4facfe; }
        button { background:#4facfe; color:#fff; padding:10px 16px; border:none; border-radius:8px; margin:6px; }
        button:hover { background:#00c6ff; cursor:pointer; }
      </style>
    </head>
    <body>
      <div class=\"box\">
        <h1>Smart Canteen</h1>
        <div class=\"mode\">Mode: <span>)rawliteral" + mode + R"rawliteral(</span></div>
        <form action='/toggle' method='POST'>
          <button type='submit' name='mode' value='register'>Register Mode</button>
          <button type='submit' name='mode' value='order'>Order Mode</button>
        </form>
      </div>
    </body>
    </html>
    )rawliteral";
    server.send(200, "text/html", html);
  });

  server.on("/toggle", HTTP_POST, []() {
    mode = server.arg("mode");
    server.sendHeader("Location", "/");
    server.send(303);
  });

  server.begin();
  Serial.println("Web server running...");
}

// ================== ThingSpeak ==================
void sendToThingSpeak(String uid, String mode, String status, String name) {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    String url = serverName + "?api_key=" + apiKey +
                 "&field1=" + uid +
                 "&field2=" + mode +
                 "&field3=" + status +
                 "&field4=" + name;
    http.begin(url);
    int code = http.GET();
    if (code > 0) Serial.println("ThingSpeak Response: " + String(code));
    else Serial.println("Error: " + String(code));
    http.end();
  }
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

  // LEDs & Buzzer
  pinMode(grantLED, OUTPUT);
  pinMode(denyLED, OUTPUT);
  pinMode(buzzer, OUTPUT);

  setupWiFi();
  setupWeb();
}

// ================== Loop ==================
void loop() {
  server.handleClient();

  if (!rfid.PICC_IsNewCardPresent() || !rfid.PICC_ReadCardSerial()) return;

  // UID
  String uid = "";
  for (byte i = 0; i < rfid.uid.size; i++) uid += String(rfid.uid.uidByte[i], HEX);
  uid.toUpperCase();
  Serial.println("Scanned UID: " + uid);

  if (mode == "register") {
    if (findUser(uid) == -1 && userCount < 10) {
      users[userCount].uid = uid;
      users[userCount].name = "User" + String(userCount + 1);
      userCount++;

      lcd.clear(); lcd.setCursor(0,0); lcd.print("Registered!");
      lcd.setCursor(0,1); lcd.print("UID: " + uid);
      tone(buzzer, 1000); delay(300); noTone(buzzer);

      sendToThingSpeak(uid, "register", "success", users[userCount-1].name);
    } else {
      lcd.clear(); lcd.setCursor(0,0); lcd.print("Already Reg.");
      tone(buzzer, 500); delay(200); noTone(buzzer);

      sendToThingSpeak(uid, "register", "failed", "exists");
    }
  } else {  // order
    int idx = findUser(uid);
    if (idx != -1) {
      lcd.clear(); lcd.setCursor(0,0); lcd.print("Order Preparing!");
      lcd.setCursor(0,1); lcd.print(users[idx].name);
      grantAccess();

      // Here you would also send MQTT message to admin/kitchen
      sendToThingSpeak(uid, "order", "preparing", users[idx].name);

    } else {
      lcd.clear(); lcd.setCursor(0,0); lcd.print("Card Not Found");
      denyAccess();
      sendToThingSpeak(uid, "order", "failed", "unknown");
    }
  }

  rfid.PICC_HaltA();
  rfid.PCD_StopCrypto1();
}

// ================== Helpers ==================
int findUser(String uid) {
  for (int i = 0; i < userCount; i++) if (users[i].uid == uid) return i;
  return -1;
}
void grantAccess() {
  digitalWrite(grantLED, HIGH); digitalWrite(denyLED, LOW);
  tone(buzzer, 1000); delay(300); noTone(buzzer);
  digitalWrite(grantLED, LOW);
}
void denyAccess() {
  digitalWrite(denyLED, HIGH); digitalWrite(grantLED, LOW);
  for (int i=0; i<2; i++) { tone(buzzer,500); delay(200); noTone(buzzer); delay(200); }
  digitalWrite(denyLED, LOW);
}
