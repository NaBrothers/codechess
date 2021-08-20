package com.nabrothers.codechess.core.enums;

public enum PlayerStatus {
    NORMAL(0), DEAD(1);

    private int code;

    PlayerStatus(int code) {
        this.code = code;
    }

    public int getCode() {
        return code;
    }

    public static PlayerStatus getByCode(int code) {
        for (PlayerStatus playerStatus : PlayerStatus.values()) {
            if (playerStatus.getCode() == code) {
                return playerStatus;
            }
        }
        return null;
    }
}
