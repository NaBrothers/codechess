package com.nabrothers.codechess.core.context;


import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.serializer.SerializerFeature;
import com.nabrothers.codechess.core.dao.BattleRecordDAO;
import com.nabrothers.codechess.core.data.Effect;
import com.nabrothers.codechess.core.data.Flyer;
import com.nabrothers.codechess.core.data.Player;
import com.nabrothers.codechess.core.dto.BattleContextDTO;
import com.nabrothers.codechess.core.enums.EffectStatus;
import com.nabrothers.codechess.core.enums.ObjectType;
import com.nabrothers.codechess.core.po.BattleRecordPO;
import com.nabrothers.codechess.core.utils.ApplicationContextProvider;
import com.nabrothers.codechess.core.utils.CopyUtils;

import java.util.*;

public class BattleContext extends Context{

    private List<BattleContextDTO> history = new ArrayList<>();

    private static final BattleRecordDAO battleRecordDAO = ApplicationContextProvider.getBean(BattleRecordDAO.class);

    public BattleContext(int id) {
        this.id = id;
    }

    private Map<Long, Player> playerMap = new HashMap();

    private Map<Long, Flyer> flyerMap = new HashMap();

    // Mock
    {
        Player rooney1 = new Player(881);
        rooney1.setX(4);
        rooney1.setY(4);
        rooney1.setHp(100);
        rooney1.setUserId(111);
        playerMap.put(rooney1.getSeq(), rooney1);
        Player rooney2 = new Player(882);
        rooney2.setX(4);
        rooney2.setY(20);
        rooney2.setHp(100);
        rooney2.setUserId(111);
        playerMap.put(rooney2.getSeq(), rooney2);
        Player rooney3 = new Player(883);
        rooney3.setX(20);
        rooney3.setY(4);
        rooney3.setHp(100);
        rooney3.setUserId(111);
        playerMap.put(rooney3.getSeq(), rooney3);
        Player rooney4 = new Player(884);
        rooney4.setX(20);
        rooney4.setY(20);
        rooney4.setHp(100);
        rooney4.setUserId(111);
        playerMap.put(rooney4.getSeq(), rooney4);
        Player monster = new Player(777);
        monster.setX(12);
        monster.setY(12);
        monster.setHp(100);
        monster.setUserId(222);
        playerMap.put(monster.getSeq(), monster);
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
        Player monster = null;
        for (Player p : playerMap.values()) {
            if (p.getId() == 777) {
                monster = p;
                break;
            }
        }
        Random random = new Random();
        switch (random.nextInt(4)) {
            case 0:
                monster.move(1, 0);
                break;
            case 1:
                monster.move(0, 1);
                break;
            case 2:
                monster.move(-1, 0);
                break;
            case 3:
                monster.move(0, -1);
                break;
        }
        for (Player rooney : playerMap.values()) {
            if (rooney.getId() != 777) {
                rooney.cast(new Flyer(999, rooney.getX(), rooney.getY(), monster.getX(), monster.getY(), 2));
            }
        }
        Iterator<Map.Entry<Long, Flyer>> it = flyerMap.entrySet().iterator();
        while (it.hasNext()) {
            Map.Entry<Long, Flyer> entry = it.next();
            if (entry.getValue().getStatus() == EffectStatus.FINISH.getCode()) {
                it.remove();
                continue;
            }
            entry.getValue().cast();
        }
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
        battleContextDTO.setFlyers(CopyUtils.copyObjects(flyerMap, Flyer.class));
        history.add(battleContextDTO);
    }


    public List<BattleContextDTO> getHistory() {
        return history;
    }

    public void setHistory(List<BattleContextDTO> history) {
        this.history = history;
    }

    public Map<Long, Player> getPlayerMap() {
        return playerMap;
    }

    public void setPlayerMap(Map<Long, Player> playerMap) {
        this.playerMap = playerMap;
    }

    public Map<Long, Flyer> getFlyerMap() {
        return flyerMap;
    }

    public void setFlyerMap(Map<Long, Flyer> flyerMap) {
        this.flyerMap = flyerMap;
    }
}
