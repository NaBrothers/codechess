package com.nabrothers.codechess.core.data;

public interface Effectable {
    default boolean cast(Effect e) {
        return true;
    }
}
