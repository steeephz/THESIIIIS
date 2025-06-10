import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    RefreshControl,
    ActivityIndicator
} from 'react-native';
import { announcementApi } from '../services/api';

const AnnouncementsScreen = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchAnnouncements = async () => {
        try {
            const data = await announcementApi.getAnnouncements();
            setAnnouncements(data);
        } catch (error) {
            console.error('Error:', error);
            // You might want to show an error message to the user
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchAnnouncements();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        fetchAnnouncements();
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-PH', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    const renderAnnouncement = ({ item }) => (
        <View style={styles.announcementCard}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.body}>{item.body}</Text>
            <View style={styles.footer}>
                <Text style={styles.date}>
                    Posted: {formatDate(item.published_at)}
                </Text>
                <Text style={styles.postedBy}>
                    By: {item.posted_by}
                </Text>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={announcements}
                renderItem={renderAnnouncement}
                keyExtractor={item => item.id.toString()}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>
                            No announcements available
                        </Text>
                    </View>
                }
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    announcementCard: {
        backgroundColor: 'white',
        margin: 10,
        padding: 15,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
    },
    body: {
        fontSize: 16,
        color: '#666',
        marginBottom: 15,
        lineHeight: 24,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderTopWidth: 1,
        borderTopColor: '#eee',
        paddingTop: 10,
    },
    date: {
        fontSize: 12,
        color: '#888',
    },
    postedBy: {
        fontSize: 12,
        color: '#888',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    emptyText: {
        fontSize: 16,
        color: '#666',
    },
});

export default AnnouncementsScreen; 