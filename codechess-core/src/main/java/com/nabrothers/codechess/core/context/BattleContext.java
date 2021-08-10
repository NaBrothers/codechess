package com.nabrothers.codechess.core.context;


import com.nabrothers.codechess.core.dto.BattleContextDTO;

import java.util.ArrayList;
import java.util.List;

public class BattleContext extends Context{

    private List<BattleContextDTO> history = new ArrayList<>();

    public BattleContext(int id) {
        this.id = id;
    }

    @Override
    protected void beforeStart() {
        logger.info("[" + id + "] 已启动", id);
    }

    @Override
    protected boolean doStep() {
        saveStep();
        return true;
    }

    @Override
    protected void afterFinish() {
        logger.info("[" + id + "] 已完成", id);
    }

    private void saveStep() {
        BattleContextDTO battleContextDTO = new BattleContextDTO();
        battleContextDTO.setStep(currentStep);
        history.add(battleContextDTO);
    }


    public List<BattleContextDTO> getHistory() {
        return history;
    }

    public void setHistory(List<BattleContextDTO> history) {
        this.history = history;
    }


}
