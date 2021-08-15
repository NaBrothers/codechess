package com.nabrothers.codechess.core.enums;

public enum EffectStatus {
    CREATE(0), START(1), FINISH(2);

    private int code;

    EffectStatus(int code) {
        this.code = code;
    }

    public int getCode() {
        return code;
    }

    public static EffectStatus getByCode(int code) {
        for (EffectStatus contextStatus : EffectStatus.values()) {
            if (contextStatus.getCode() == code) {
                return contextStatus;
            }
        }
        return null;
    }
}