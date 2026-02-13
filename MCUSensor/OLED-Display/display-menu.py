from machine import Pin, I2C
import ssd1306
import time

# --- NASTAVENÍ PINŮ ---
# I2C pro OLED
i2c = I2C(0, sda=Pin(0), scl=Pin(1), freq=400000)
oled_width = 128
oled_height = 64
oled = ssd1306.SSD1306_I2C(oled_width, oled_height, i2c)

# Rotační enkodér
CLK_PIN = 2
DT_PIN = 3
SW_PIN = 4

clk = Pin(CLK_PIN, Pin.IN, Pin.PULL_UP)
dt = Pin(DT_PIN, Pin.IN, Pin.PULL_UP)
sw = Pin(SW_PIN, Pin.IN, Pin.PULL_UP)

# --- DEFINICE MENU ---
menu_items = [
    "Mereni Teploty",
    "Nastaveni Wifi",
    "Jas Displeje",
    "Informace o sys",
    "Restartovat",
    "Vypnout"
]

current_index = 0
last_index = -1  # Pro kontrolu překreslení
button_pressed = False

# --- LOGIKA ENKODÉRU ---
last_clk = clk.value()

def handle_encoder(pin):
    global current_index, last_clk
    current_clk = clk.value()
    current_dt = dt.value()
    
    if current_clk != last_clk:
        if current_clk == 0:  # Detekce hrany dolů
            # Rozhodnutí směru podle stavu DT
            if current_dt != current_clk:
                current_index += 1
            else:
                current_index -= 1
            
            # Ošetření přetečení (cyklické menu)
            if current_index >= len(menu_items):
                current_index = 0
            elif current_index < 0:
                current_index = len(menu_items) - 1
                
    last_clk = current_clk

# Připojení přerušení (IRQ) na CLK pin enkodéru
clk.irq(trigger=Pin.IRQ_FALLING | Pin.IRQ_RISING, handler=handle_encoder)

# --- LOGIKA TLAČÍTKA ---
def handle_button(pin):
    global button_pressed
    # Jednoduchý debounce
    time.sleep_ms(20)
    if sw.value() == 0:
        button_pressed = True

sw.irq(trigger=Pin.IRQ_FALLING, handler=handle_button)

# --- VYKRESLOVÁNÍ ---
def draw_menu():
    oled.fill(0) # Vyčistit obrazovku
    
    # Vypočítáme indexy pro položku nahoře a dole
    prev_index = (current_index - 1) % len(menu_items)
    next_index = (current_index + 1) % len(menu_items)
    
    # 1. Horní položka (malá, šedá/normální)
    # Souřadnice: X=10, Y=5
    oled.text(menu_items[prev_index], 10, 5, 1)
    
    # 2. PROSTŘEDNÍ POLOŽKA (Zvýrazněná)
    # Nakreslíme bílý obdélník přes celou šířku uprostřed
    # Y začíná na 22, výška 20px
    oled.fill_rect(0, 22, 128, 20, 1)
    
    # Text vypíšeme černě (color=0) na bílé pozadí
    # Přidáme šipky ">" pro efekt
    selected_text = "> " + menu_items[current_index] + " <"
    
    # Vycentrování textu (zhruba)
    text_width = len(selected_text) * 8
    x_pos = (128 - text_width) // 2
    oled.text(selected_text, x_pos, 28, 0) # color 0 = černá
    
    # 3. Dolní položka (malá)
    # Souřadnice: X=10, Y=50
    oled.text(menu_items[next_index], 10, 50, 1)
    
    # Vykreslení
    oled.show()

def perform_action(item_name):
    oled.fill(0)
    oled.text("Potvrzeno:", 5, 20, 1)
    oled.text(item_name, 5, 40, 1)
    oled.show()
    time.sleep(1) # Pauza pro zobrazení akce
    # Zde by se volala funkce podle výběru

# --- HLAVNÍ SMYČKA ---
while True:
    # Překresli jen když se změní výběr
    if current_index != last_index:
        draw_menu()
        last_index = current_index
    
    # Kontrola tlačítka
    if button_pressed:
        print(f"Vybrano: {menu_items[current_index]}")
        perform_action(menu_items[current_index])
        button_pressed = False
        draw_menu() # Vrátit zpět menu
        
    time.sleep_ms(10) # Malá pauza pro uvolnění CPU
