package com.nabrothers.codechess.core.enums;

public enum BattleStatus {
    CREATE(0), START(1), FINISH(2);

    private int code;

    BattleStatus(int code) {
        this.code = code;
    }

    public int getCode() {
        return code;
    }

    public static BattleStatus getByCode(int code) {
        for (BattleStatus battleStatus : BattleStatus.values()) {
            if (battleStatus.getCode() == code) {
                return battleStatus;
            }
        }
        return null;
    }
}