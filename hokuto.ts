namespace Hokuto {

    let m_saikoro_display: HTMLElement;
    let m_game_screen: HTMLElement;
    let m_message_stack: string[] = [];

    let m_mode: number = 0;
    let m_bonus_count: number = 0;
    let m_yuwasshaed: boolean = false;
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

        let next_button = document.getElementById('next_button');
        if (next_button != null) {
            next_button.addEventListener('click', nextStep);
        }

        let reset_button = document.getElementById('reset_button');
        if (reset_button != null) {
            reset_button.addEventListener('click', reset);
        }

        let method = 'GET';
        let url = 'data.txt';
        let async = true;
        let data = '';

        let xhr: XMLHttpRequest = new XMLHttpRequest();
        xhr.abort();

        xhr.open(method, url, async);
        xhr.setRequestHeader("If-Modified-Since", "Thu, 01 Jun 1970 00:00:00 GMT");

        xhr.addEventListener('readystatechange', (): void => {
            if (xhr.readyState == 4) {
                init(xhr.responseText);
            }
        });

        xhr.send(data);
    });

    function init(code: string) {
        try {
            eval(code);

        } catch {

        }

        reset();
    }

    function reset() {
        m_mode = 4;
        m_bonus_count = 0;
        m_yuwasshaed = false;
        m_gameover = false;

        m_saikoro_max = 0;
        m_saikoro_value = 0;

        m_saikoro_display.textContent = '';
        m_game_screen.textContent = '';

        m_message_stack.length = 0;

        m_message_stack.push('スタート');
        nextStep();
    }

    function add_message(message: string) {
        let element = document.createElement('div');
        element.innerHTML = message;
        m_game_screen.appendChild(element);

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

    let next_mode_table: number[][] = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 2000, 500, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 1000, 800, 150, 50],
        [0, 0, 0, 0, 0, 0, 0, 1, 1, 1198, 800],
        [580, 0, 0, 0, 4, 8, 8, 1400, 0, 0, 0],
        [380, 0, 0, 0, 4, 8, 8, 0, 1600, 0, 0],
        [368, 0, 0, 0, 8, 16, 8, 0, 0, 1700, 0],
        [168, 0, 0, 0, 8, 16, 8, 0, 0, 0, 1800]
    ];

    let aura_table: number[][] = [
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [30000, 15000, 8000, 2000, 500, 250],
        [22016, 15000, 15000, 8000, 2000, 500],
        [1000, 10000, 15000, 15000, 8000, 2000],
        [5000, 5000, 5000, 15000, 15000, 15000]
    ];

    let enshutsu_win_table: number[][] = [
        [100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100],
        [100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100],
        [100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100],
        [100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100]
    ];

    let aura_color_table = ['白', '黒', '赤', '青', '黄', '緑'];

    let enshutsu_win_message_table: string[][] = [
        ['コン', 'パンチ', 'ガード', 'そんなやわな拳では、痛くもないわ!'],
        ['コン', 'パンチ', 'ヒット', '油断したわ　コンシロウ'],
        ['コン', 'キック', 'ガード', 'そんなやわな拳では、痛くもないわ!'],
        ['コン', 'キック', 'ヒット', '油断したわ　コンシロウ'],
        ['コン', '千年波', 'ガード', 'そんなやわな拳では、痛くもないわ!'],
        ['コン', '千年波', 'ヒット', '油断したわ　コンシロウ'],
        ['コン', 'ルイ', 'ビヨーーン', 'ヒット', 'こ･･･これはルイの拳!', '油断したわ　コンシロウ'],
        ['リオウ', 'パンチ', 'サッ', 'リオウよ、お帰りの時間が来たのだ!!'],
        ['リオウ', 'パンチ', 'タキ<br>サッ', 'こ･･･この動きは･･･タ･･･タキ!', 'リオウよ、お帰りの時間が来たのだ!!'],
        ['リオウ', 'パンチ', 'ドガッ', '貴様のチカラはその程度か。', 'ハッ', 'ウオォォォォ!'],
        ['リオウ', 'パンチ', 'ドガッ', '貴様のチカラはその程度か。', 'ぐはっ', 'BONUS count 終', 'コーン!', 'ウオォォォォ!'],
        ['リオウ', 'パンチ', 'ドガッ', '貴様のチカラはその程度か。', 'ぐはっ', 'BONUS count 終', 'コン!', 'ウオォォォォ!'],
        ['リオウ', 'キック', 'サッ', 'リオウよ、お帰りの時間が来たのだ!!'],
        ['リオウ', 'キック', 'タキ<br>サッ', 'こ･･･この動きは･･･タ･･･タキ!', 'リオウよ、お帰りの時間が来たのだ!!'],
        ['リオウ', 'キック', 'ドガッ', '貴様のチカラはその程度か。', 'ハッ', 'ウオォォォォ!'],
        ['リオウ', 'キック', 'ドガッ', '貴様のチカラはその程度か。', 'ぐはっ', 'BONUS count 終', 'コーン!', 'ウオォォォォ!'],
        ['リオウ', 'キック', 'ドガッ', '貴様のチカラはその程度か。', 'ぐはっ', 'BONUS count 終', 'コン!', 'ウオォォォォ!'],
        ['リオウ', '掌底拳', 'サッ', 'リオウよ、お帰りの時間が来たのだ!!'],
        ['リオウ', '掌底拳', 'タキ<br>サッ', 'こ･･･この動きは･･･タ･･･タキ!', 'リオウよ、お帰りの時間が来たのだ!!'],
        ['リオウ', '掌底拳', 'ボワーーー', '貴様のチカラはその程度か。', 'ハッ', 'ウオォォォォ!'],
        ['リオウ', '掌底拳', 'ボワーーー', '貴様のチカラはその程度か。', 'ぐはっ', 'BONUS count 終', 'コーン!', 'ウオォォォォ!'],
        ['リオウ', '掌底拳', 'ボワーーー', '貴様のチカラはその程度か。', 'ぐはっ', 'BONUS count 終', 'コン!', 'ウオォォォォ!']
    ];

    let enshutsu_lose_table: number[] = [5000, 20000, 40000];

    let enshutsu_lose_message_table: string[][] = [
        ['リオウ', 'パンチ', 'ドガッ', '貴様のチカラはその程度か。', 'ぐはっ'],
        ['リオウ', 'キック', 'ドガッ', '貴様のチカラはその程度か。', 'ぐはっ'],
        ['リオウ', '掌底拳', 'ボワーーー', '貴様のチカラはその程度か。', 'ぐはっ'],
    ];

    let enshutsu_ending_message_list: string[] = [
        '次の一撃が最後となるだろう',
        'やられろ　コンシロウ!!<br>ウォーター',
        'ば･･･ばかな･･･!!',
        'このリオウ家に帰るのに親の手は借りぬ!!<br>我生涯に少々の迷いなし!!',
        'リオウよ　俺には貴方が最高の強敵だった'
    ];

    function nextStep() {
        if (0 < m_message_stack.length) {
            let message = m_message_stack.shift() || '';

            add_message(message);

            if (m_message_stack.length <= 0) {
                if (4 <= m_mode && m_mode <= 10) {
                    let saikoro_max = sumArray(next_mode_table[m_mode]);
                    start_saikoro(saikoro_max);
                }
            }

            return;
        }

        if (m_gameover) {
            return;
        }

        stop_saikoro();
        let value = m_saikoro_value;

        if (m_mode == 4) {
            add_message('BONUS 確定');
            m_bonus_count = 0;

            m_mode = choiceValue(next_mode_table[m_mode], value);

            let saikoro_max = sumArray(next_mode_table[m_mode]);
            start_saikoro(saikoro_max);

        } else if (5 <= m_mode && m_mode <= 6) {
            if (m_mode == 5) {
                add_message('７');

                m_mode = choiceValue(next_mode_table[m_mode], value);

            } else if (m_mode == 6) {
                add_message('北');

                m_mode = choiceValue(next_mode_table[m_mode], value);

            }

            let aura_level = choiceValue(aura_table[m_mode]);
            let aura_color = aura_color_table[aura_level];

            m_message_stack.push('BATTLE BONUS ゲット【' + aura_color + '】<span style="color:white">' + m_mode + '</span>');

        } else if (7 <= m_mode && m_mode <= 10) {
            m_bonus_count++;
            add_message('アタ、アタ、ホワァッター<br>ウェーヘッヘー');

            m_mode = choiceValue(next_mode_table[m_mode], value);

            let yuwassha = '';
            if (7 <= m_mode && m_mode <= 10) {
                if (!m_yuwasshaed && 10 <= m_bonus_count) {
                    if (choiceValue([100, 100, 100]) == 0) {
                        yuwassha = 'ユワッシャー<br>';
                        m_yuwasshaed = true;
                    }
                }
            }
            m_message_stack.push(yuwassha + 'BONUS ' + m_bonus_count);

            if (7 <= m_mode && m_mode <= 10) {
                let enshutsu_number = choiceValue(enshutsu_win_table[m_mode - 7]);
                let enshutsu_message_list = enshutsu_win_message_table[enshutsu_number];

                for (let i = 0, len = enshutsu_message_list.length; i < len; i++) {
                    let message = enshutsu_message_list[i];
                    if (message == 'BONUS count 終') {
                        m_message_stack.push('BONUS ' + m_bonus_count + ' 終');

                    } else {
                        m_message_stack.push(message);
                    }
                }

                m_message_stack.push('BONUS +1 ピキン!ドゴーン!');

            } else {
                let enshutsu_number = choiceValue(enshutsu_lose_table);
                let enshutsu_message_list: string[];

                if (20 <= m_bonus_count) {
                    enshutsu_message_list = enshutsu_ending_message_list;
                } else {
                    enshutsu_message_list = enshutsu_lose_message_table[enshutsu_number];
                }

                for (let i = 0, len = enshutsu_message_list.length; i < len; i++) {
                    let message = enshutsu_message_list[i];
                    m_message_stack.push(message);
                }

                m_message_stack.push('BONUS ' + m_bonus_count + ' 終');
                m_message_stack.push('バシーン');

                m_gameover = !(4 <= m_mode && m_mode <= 6);
            }
        }
    }

    function sumArray(numberArray: number[]): number {
        let sum = 0;
        for (let i = 0; i < numberArray.length; i++) {
            sum += numberArray[i];
        }

        return sum;
    }

    function choiceValue(kakutable: number[], shikou?: number): number {
        if (shikou == undefined) {
            let zentai = sumArray(kakutable);
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
