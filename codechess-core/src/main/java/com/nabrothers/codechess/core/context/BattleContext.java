package com.nabrothers.codechess.core.context;


import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.serializer.SerializerFeature;
import com.nabrothers.codechess.core.dao.BattleRecordDAO;
import com.nabrothers.codechess.core.data.Player;
import com.nabrothers.codechess.core.dto.BattleContextDTO;
import com.nabrothers.codechess.core.enums.ObjectType;
import com.nabrothers.codechess.core.po.BattleRecordPO;
import com.nabrothers.codechess.core.utils.ApplicationContextProvider;
import com.nabrothers.codechess.core.utils.CopyUtils;

import java.util.ArrayList;
import java.util.Map;
import java.util.HashMap;
import java.util.List;
import java.util.Random;

public class BattleContext extends Context{

    private List<BattleContextDTO> history = new ArrayList<>();

    private static final BattleRecordDAO battleRecordDAO = ApplicationContextProvider.getBean(BattleRecordDAO.class);

    public BattleContext(int id) {
        this.id = id;
    }

    private Map<Long, Player> playerMap = new HashMap();

    // Mock
    {
        Player rooney = new Player(888, ObjectType.PLAYER.getCode());
        rooney.setX(4);
        rooney.setY(20);
        playerMap.put(rooney.getSeq(), rooney);
    }

    @Override
    protected void beforeStart() {
        logger.info("[" + id + "] 已启动", id);
        BattleRecordPO record = new BattleRecordPO();
        record.setId(id);
        record.setStatus(status);
        battleRecordDAO.update(record);
        saveStep();
    }

    @Override
    protected boolean doStep() {
        Random rand = new Random();
        Player rooney = (Player)playerMap.values().toArray()[0];
        rooney.moveTo(20, 4);
        saveStep();
        if (currentStep > 100) {
            return false;
        }
        return true;
    }

    @Override
    protected void afterFinish() {
        logger.info("[" + id + "] 已完成", id);
        BattleRecordPO record = new BattleRecordPO();
        record.setId(id);
        record.setStatus(status);
        record.setResult(JSON.toJSONString(history, SerializerFeature.DisableCircularReferenceDetect));
        battleRecordDAO.update(record);
    }

    private void saveStep() {
        BattleContextDTO battleContextDTO = new BattleContextDTO();
        battleContextDTO.setStep(currentStep);
        battleContextDTO.setPlayers(CopyUtils.copyObjects(playerMap, Player.class));
        history.add(battleContextDTO);
    }


    public List<BattleContextDTO> getHistory() {
        return history;
    }

    public void setHistory(List<BattleContextDTO> history) {
        this.history = history;
    }


}
