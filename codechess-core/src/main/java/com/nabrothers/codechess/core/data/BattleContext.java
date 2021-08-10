package com.nabrothers.codechess.core.data;


import com.nabrothers.codechess.core.dto.BattleContextDTO;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.util.ArrayList;
import java.util.List;

public class BattleContext {
    private int id;

    private int currentStep;

    private int status;

    private Logger logger = LogManager.getLogger(BattleContext.class);

    private List<BattleContextDTO> history = new ArrayList<>();

    public BattleContext(int id) {
        this.id = id;
    }

    public void start() {
        logger.info("[" + id + "] 已启动", id);
        doStart();
    }

    private void doStart() {

    }

    private void snapshot() {
        BattleContextDTO battleContextDTO = new BattleContextDTO();
        battleContextDTO.setStep(currentStep);
        history.add(battleContextDTO);
    }

    public int getCurrentStep() {
        return currentStep;
    }

    public void setCurrentStep(int currentStep) {
        this.currentStep = currentStep;
    }

    public List<BattleContextDTO> getHistory() {
        return history;
    }

    public void setHistory(List<BattleContextDTO> history) {
        this.history = history;
    }

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }
}
