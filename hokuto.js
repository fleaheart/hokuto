"use strict";
var Hokuto;
(function (Hokuto) {
    let m_saikoro_display;
    let m_game_screen;
    let m_mode = 0;
    let m_saikoro_max = 0;
    let m_saikoro_value = 0;
    window.addEventListener('load', () => {
        let saikoro_display = document.getElementById('saikoro_display');
        if (saikoro_display != null) {
            m_saikoro_display = saikoro_display;
        }
        let game_screen = document.getElementById('game_screen');
        if (game_screen != null) {
            m_game_screen = game_screen;
        }
        let element = document.getElementById('next_button');
        if (element != null) {
            element.addEventListener('click', nextStep);
        }
        m_mode = 4;
        start_saikoro(2048);
    });
    function add_message(message) {
        m_game_screen.appendChild(document.createTextNode(message));
        m_game_screen.appendChild(document.createElement('br'));
    }
    function start_saikoro(saikoro_max) {
        m_saikoro_max = saikoro_max;
        window.setTimeout(kaiten_saikoro, 40);
    }
    function stop_saikoro() {
        m_saikoro_max = 0;
    }
    function kaiten_saikoro() {
        if (m_saikoro_max <= 0) {
            return;
        }
        m_saikoro_value = Math.floor(Math.random() * m_saikoro_max);
        m_saikoro_display.textContent = String(m_saikoro_value);
        window.setTimeout(kaiten_saikoro, 100);
    }
    function nextStep() {
        stop_saikoro();
        let value = m_saikoro_value;
        add_message('サイコロは:' + value);
        if (m_mode == 4) {
            m_mode = choiceValue([0, 0, 0, 0, 0, 2000, 48], value);
        }
        else if (m_mode == 5) {
            add_message('７');
            m_mode = choiceValue([0, 0, 0, 0, 0, 0, 0, 1184, 800, 40, 24], value);
        }
        else if (m_mode == 6) {
            add_message('北');
            m_mode = choiceValue([0, 0, 0, 0, 0, 0, 0, 1, 1, 1246, 800], value);
        }
        else if (m_mode == 7) {
            m_mode = choiceValue([632, 0, 0, 0, 4, 8, 4, 1400, 0, 0, 0], value);
        }
        else if (m_mode == 8) {
            m_mode = choiceValue([432, 0, 0, 0, 4, 8, 4, 0, 1600, 0, 0], value);
        }
        else if (m_mode == 9) {
            m_mode = choiceValue([300, 0, 0, 0, 8, 16, 4, 0, 0, 1700, 0], value);
        }
        else if (m_mode == 10) {
            m_mode = choiceValue([220, 0, 0, 0, 8, 16, 4, 0, 0, 0, 1800], value);
        }
        if (4 <= m_mode && m_mode <= 10) {
            start_saikoro(2048);
        }
        add_message('次のモードは:' + m_mode);
    }
    function choiceValue(kakutable, shikou) {
        let zentai = 0;
        for (let i = 0; i < kakutable.length; i++) {
            zentai += kakutable[i];
        }
        let hikaku = 0;
        for (let i = 0; i < kakutable.length; i++) {
            hikaku += kakutable[i];
            if (shikou <= hikaku) {
                return i;
            }
        }
        throw 'overflow';
    }
})(Hokuto || (Hokuto = {}));
