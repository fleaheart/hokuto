namespace Hokuto {

    let m_saikoro_display: HTMLElement;
    let m_game_screen: HTMLElement;

    let m_mode: number = 0;
    let m_bonus_count: number = 0;
    let m_gameover: boolean = false;

    let m_saikoro_max: number = 0;
    let m_saikoro_value: number = 0;

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

    function add_message(message: string) {
        m_game_screen.appendChild(document.createTextNode(message));
        m_game_screen.appendChild(document.createElement('br'));

        setTimeout(scroll_message, 40);
    }

    function scroll_message() {
        let y = m_game_screen.scrollTop;

        m_game_screen.scrollBy(0, 10);

        if (y < m_game_screen.scrollTop) {
            setTimeout(scroll_message, 40);
        }
    }

    function start_saikoro(saikoro_max: number) {
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

    let m_enshutsu_stack: string[] = [];

    function nextStep() {
        if (0 < m_enshutsu_stack.length) {
            let msg = m_enshutsu_stack.shift() || '';

            add_message(msg);

            if (m_enshutsu_stack.length <= 0) {
                if (7 <= m_mode && m_mode <= 10) {
                    start_saikoro(2048);
                }
            }

            return;
        }

        if (m_gameover) {
            return;
        }

        stop_saikoro();

        let value = m_saikoro_value;

        if (4 <= m_mode && m_mode <= 10) {
            add_message('サイコロは:' + value);
        }

        if (m_mode == 4) {

            m_enshutsu_stack.push('bonus kakutei');

            m_mode = choiceValue([0, 0, 0, 0, 0, 2000, 48], value);

            m_bonus_count = 0;

        } else if (m_mode == 5) {
            m_enshutsu_stack.push('７');

            m_mode = choiceValue([0, 0, 0, 0, 0, 0, 0, 1184, 800, 40, 24], value);

        } else if (m_mode == 6) {
            m_enshutsu_stack.push('北');

            m_mode = choiceValue([0, 0, 0, 0, 0, 0, 0, 1, 1, 1246, 800], value);

        } else if (m_mode == 7) {

            m_mode = choiceValue([632, 0, 0, 0, 4, 8, 4, 1400, 0, 0, 0], value);

        } else if (m_mode == 8) {

            m_mode = choiceValue([432, 0, 0, 0, 4, 8, 4, 0, 1600, 0, 0], value);

        } else if (m_mode == 9) {

            m_mode = choiceValue([300, 0, 0, 0, 8, 16, 4, 0, 0, 1700, 0], value);

        } else if (m_mode == 10) {

            m_mode = choiceValue([220, 0, 0, 0, 8, 16, 4, 0, 0, 0, 1800], value);

        }

        if (4 <= m_mode && m_mode <= 6) {
            start_saikoro(2048);

        } else if (7 <= m_mode && m_mode <= 10) {
            m_bonus_count++;

            m_enshutsu_stack.push('コン');
            m_enshutsu_stack.push('パンチ');
            m_enshutsu_stack.push('ガード');
            m_enshutsu_stack.push('そんなやわな拳では、この体に傷ひとつつける事はできぬわ!');

            m_enshutsu_stack.push('BONUS +1 ピキン!ドゴーン!');

        } else {
            m_enshutsu_stack.push('リオウ');
            m_enshutsu_stack.push('パンチ');
            m_enshutsu_stack.push('ドガッ');
            m_enshutsu_stack.push('うぬの力はその程度か。');
            m_enshutsu_stack.push('ウッ');

            m_enshutsu_stack.push('BONUS ' + m_bonus_count + ' 終');
            m_enshutsu_stack.push('バシーン');

            m_gameover = true;
        }

    }

    function choiceValue(kakutable: number[], shikou?: number): number {
        let zentai = 0;
        for (let i = 0; i < kakutable.length; i++) {
            zentai += kakutable[i];
        }

        if (shikou == undefined) {
            shikou = Math.floor(Math.random() * zentai);
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

}
