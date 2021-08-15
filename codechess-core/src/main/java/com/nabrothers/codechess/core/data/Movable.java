package com.nabrothers.codechess.core.data;

public interface Movable {
    default boolean move(int dx, int dy) { return true; }

    default boolean moveTo(int nx, int ny) { return true; }
}
