package com.nabrothers.codechess.core.utils;

import org.dozer.DozerBeanMapper;
import org.dozer.Mapper;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * 单个对象属性拷贝、列表对象拷贝
 * <p>
 * 拷贝类型：深拷贝
 * 浅拷贝见CopierUtil
 *
 * @author itoak
 */
public class CopyUtils {

    /**
     * 单个对象属性拷贝
     *
     * @param source 源对象
     * @param clazz  目标对象Class
     * @param <T>    目标对象类型
     * @param <M>    源对象类型
     * @return 目标对象
     */
    public static <T, M> T copyProperties(M source, Class<T> clazz) {
        if (Objects.isNull(source) || Objects.isNull(clazz))
            throw new IllegalArgumentException();
        Mapper mapper = BeanHolder.MAPPER.getMapper();
        return mapper.map(source, clazz);
    }

    /**
     * 列表对象拷贝
     *
     * @param sources 源列表
     * @param clazz   源列表对象Class
     * @param <T>     目标列表对象类型
     * @param <M>     源列表对象类型
     * @return 目标列表
     */
    public static <T, M> List<T> copyObjects(List<M> sources, Class<T> clazz) {
        if (Objects.isNull(sources) || Objects.isNull(clazz) || sources.isEmpty())
            throw new IllegalArgumentException();
        return Optional.of(sources)
                .orElse(new ArrayList<>())
                .stream().map(m -> copyProperties(m, clazz))
                .collect(Collectors.toList());
    }

    /**
     * 单例
     * <p>
     * DozerBeanMapper使用单例，有利于提高程序性能
     */
    private enum BeanHolder {
        MAPPER;

        private DozerBeanMapper mapper;

        BeanHolder() {
            this.mapper = new DozerBeanMapper();
        }

        public DozerBeanMapper getMapper() {
            return mapper;
        }
    }
}