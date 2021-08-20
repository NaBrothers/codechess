package com.nabrothers.codechess.core.data;

public class Static extends Effect{
    @Override
    protected boolean cast() {
        return true;
    }

    @Override
    protected boolean addEffect(CodeObject o) {
        return true;
    }

    @Override
    protected boolean finish() {
        return false;
    }
}
